function validateBody(schema) {
  return (req, res, next) => {
    const parse = schema.safeParse(req.body);
    if (!parse.success) return res.status(422).json({ data: null, error: { message: parse.error.flatten() } });
    req.body = parse.data;
    next();
  };
}

function validateParams(schema) {
  return (req, res, next) => {
    const parse = schema.safeParse(req.params);
    if (!parse.success) return res.status(422).json({ data: null, error: { message: parse.error.flatten() } });
    req.params = parse.data;
    next();
  };
}

function validateQuery(schema) {
  return (req, res, next) => {
    const parse = schema.safeParse(req.query);
    if (!parse.success) return res.status(422).json({ data: null, error: { message: parse.error.flatten() } });
    req.query = parse.data;
    next();
  };
}

module.exports = {
  validateBody,
  validateParams,
  validateQuery,
};
