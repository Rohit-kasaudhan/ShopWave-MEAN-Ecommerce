const { validationResult } = require("express-validator");

const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors = {};

    errors.array().forEach(err => {
      const field = err.path;

      if (!formattedErrors[field]) {
        formattedErrors[field] = [];
      }

      formattedErrors[field].push(err.msg);
    });

    const firstMsg = errors.array()[0]?.msg || "Validation failed";

    return res.status(400).json({
      success: false,
      message: firstMsg,
      errors: formattedErrors,
    });
  }

  next();
};

module.exports = validate;
