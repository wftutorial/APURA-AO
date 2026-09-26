const assert = require('node:assert/strict');
const test = require('node:test');
const { reconstruct } = require('../backend/src/services/qrReconstructor');
const { parse } = require('../backend/src/services/buParser');
const { validate } = require('../backend/src/services/buValidator');

test('reconstrói QR Codes fora de ordem e interpreta campos do BU', () => {
  const reconstruction = reconstruct([
    { index: 2, total: 2, content: '2/2;MUNI=Alto Longá;ZONA=0047;SECA=0072' },
    { index: 1, total: 2, content: '1/2;TURN=1;APTA=244;TOTC=232;BRAN=1;NULO=4' },
  ]);
  const parsed = parse(reconstruction.content);

  assert.equal(reconstruction.complete, true);
  assert.deepEqual(reconstruction.missing, []);
  assert.equal(parsed.municipio, 'Alto Longá');
  assert.equal(parsed.zona, '0047');
  assert.equal(parsed.secao, '0072');
  assert.equal(parsed.eleitores_aptos, 244);
  assert.equal(parsed.comparecimento, 232);
});

test('marca QR Code incompleto sem contabilizar o BU', () => {
  const reconstruction = reconstruct([{ index: 1, total: 3, content: '1/3;MUNI=Teste' }]);
  const parsed = parse(reconstruction.content);
  const validation = validate(parsed, reconstruction);

  assert.equal(reconstruction.complete, false);
  assert.deepEqual(reconstruction.missing, [2, 3]);
  assert.equal(validation.status, 'PENDENTE');
  assert.match(validation.errors[0], /incompleto/i);
});

test('preserva campos desconhecidos e não inventa candidato', () => {
  const parsed = parse('MUNI=Teste;CAND_X=12345;NOMI=10');
  assert.equal(parsed.unknown_fields.CAND_X, '12345');
  assert.equal(parsed.candidato, undefined);
});
