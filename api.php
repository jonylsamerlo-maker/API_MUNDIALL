<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

$fixtureFile = __DIR__ . '/fixture.json';

function respond($payload, int $status = 200): void
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    exit;
}

function readFixture(string $path): array
{
    if (!file_exists($path)) {
        return [];
    }

    $content = file_get_contents($path);
    if ($content === false) {
        respond(['status' => 'error', 'mensaje' => 'No se pudo leer el archivo de fixture.'], 500);
    }

    $data = json_decode($content, true);
    if (!is_array($data)) {
        respond(['status' => 'error', 'mensaje' => 'El archivo de fixture contiene JSON inválido.'], 500);
    }

    return $data;
}

function writeFixture(string $path, array $data): void
{
    $json = json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    if ($json === false) {
        respond(['status' => 'error', 'mensaje' => 'No se pudo codificar el fixture a JSON.'], 500);
    }

    $result = file_put_contents($path, $json, LOCK_EX);
    if ($result === false) {
        respond(['status' => 'error', 'mensaje' => 'No se pudo guardar el archivo de fixture.'], 500);
    }
}

function getJsonInput(): array
{
    $rawInput = file_get_contents('php://input');
    if (!$rawInput) {
        return [];
    }

    $data = json_decode($rawInput, true);
    if (!is_array($data)) {
        respond(['status' => 'error', 'mensaje' => 'JSON inválido en el cuerpo de la petición.'], 400);
    }

    return $data;
}

function generateId(array $fixture): string
{
    $existingIds = array_map(fn($item) => isset($item['id']) ? (string)$item['id'] : '', $fixture);

    do {
        $id = (string)(time() . mt_rand(1000, 9999));
    } while (in_array($id, $existingIds, true));

    return $id;
}

function validateMatchData(array $data, bool $isCreate = false): array
{
    $errors = [];
    $statusOptions = ['Programado', 'En vivo', 'Finalizado'];

    $phase = trim($data['phase'] ?? '');
    $group = trim($data['group'] ?? '');
    $homeTeam = trim($data['homeTeam'] ?? '');
    $awayTeam = trim($data['awayTeam'] ?? '');
    $stadium = trim($data['stadium'] ?? '');
    $city = trim($data['city'] ?? '');
    $date = trim($data['date'] ?? '');
    $status = trim($data['status'] ?? 'Programado');
    $homeScore = $data['homeScore'] ?? 0;
    $awayScore = $data['awayScore'] ?? 0;

    if ($phase === '') {
        $errors[] = 'phase es obligatorio.';
    }

    if ($group === '') {
        $errors[] = 'group es obligatorio.';
    }

    if ($homeTeam === '') {
        $errors[] = 'homeTeam es obligatorio.';
    }

    if ($awayTeam === '') {
        $errors[] = 'awayTeam es obligatorio.';
    }

    if ($stadium === '') {
        $errors[] = 'stadium es obligatorio.';
    }

    if ($city === '') {
        $errors[] = 'city es obligatorio.';
    }

    if ($date === '' || strtotime($date) === false) {
        $errors[] = 'date debe tener un formato válido.';
    }

    if (!in_array($status, $statusOptions, true)) {
        $errors[] = 'status debe ser Programado, En vivo o Finalizado.';
    }

    if (!is_int($homeScore) || $homeScore < 0) {
        $errors[] = 'homeScore debe ser un entero mayor o igual a 0.';
    }

    if (!is_int($awayScore) || $awayScore < 0) {
        $errors[] = 'awayScore debe ser un entero mayor o igual a 0.';
    }

    if (count($errors) > 0) {
        respond(['status' => 'error', 'errores' => $errors], 400);
    }

    return [
        'phase' => $phase,
        'group' => $group,
        'homeTeam' => $homeTeam,
        'awayTeam' => $awayTeam,
        'stadium' => $stadium,
        'city' => $city,
        'date' => $date,
        'status' => $status,
        'homeScore' => $homeScore,
        'awayScore' => $awayScore,
    ];
}

$method = $_SERVER['REQUEST_METHOD'];
$fixture = readFixture($fixtureFile);

if ($method === 'GET') {
    respond($fixture);
}

if ($method === 'POST') {
    $payload = getJsonInput();
    $validated = validateMatchData($payload, true);
    $newMatch = array_merge(['id' => generateId($fixture)], $validated);
    $fixture[] = $newMatch;
    writeFixture($fixtureFile, $fixture);
    respond(['status' => 'success', 'mensaje' => 'Partido creado correctamente.', 'data' => $newMatch], 201);
}

if ($method === 'PUT') {
    $payload = getJsonInput();
    $id = isset($payload['id']) ? (string)$payload['id'] : null;

    if ($id === null || $id === '') {
        respond(['status' => 'error', 'mensaje' => 'id es obligatorio para actualizar.'], 400);
    }

    $validated = validateMatchData($payload, false);
    $updated = false;

    foreach ($fixture as &$match) {
        if (isset($match['id']) && (string)$match['id'] === $id) {
            $match = array_merge($match, $validated, ['id' => $id]);
            $updated = true;
            break;
        }
    }
    unset($match);

    if (!$updated) {
        respond(['status' => 'error', 'mensaje' => 'Partido no encontrado.'], 404);
    }

    writeFixture($fixtureFile, $fixture);
    respond(['status' => 'success', 'mensaje' => 'Partido actualizado correctamente.']);
}

if ($method === 'DELETE') {
    $payload = getJsonInput();
    $id = isset($payload['id']) ? (string)$payload['id'] : ($_GET['id'] ?? null);

    if ($id === null || $id === '') {
        respond(['status' => 'error', 'mensaje' => 'id es obligatorio para eliminar.'], 400);
    }

    $newFixture = array_filter($fixture, fn($match) => !isset($match['id']) || (string)$match['id'] !== $id);

    if (count($newFixture) === count($fixture)) {
        respond(['status' => 'error', 'mensaje' => 'Partido no encontrado.'], 404);
    }

    writeFixture($fixtureFile, array_values($newFixture));
    respond(['status' => 'success', 'mensaje' => 'Partido eliminado correctamente.']);
}

respond(['status' => 'error', 'mensaje' => 'Método no soportado.'], 405);
