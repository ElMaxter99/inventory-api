function success(data = null, meta = null) {
  return { data, meta, error: null };
}

function fail(message, code) {
  return { data: null, error: { message, code } };
}

module.exports = { success, fail };
