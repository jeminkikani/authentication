const Joi = require("joi");

const registerValidation = (data) => {
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
        email: Joi.string().min(6).required().email(),
        phone: Joi.string().min(10).required(),
        password: Joi.string().min(6).required(),
        confPassword: Joi.any()
            .equal(Joi.ref("password"))
            .required()
            .label("Confirm password")
            .messages({ "any.only": "{{#label}} does not match" }),
        gender: Joi.string(),
        address: Joi.string(),
        hobbies: Joi.array().items(Joi.string()),
        dob: Joi.date(),
    });
    return schema.validate(data);
};

const loginValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required(),
    });
    return schema.validate(data);
};

const resetPasswordValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required(),
        confPassword: Joi.any()
            .equal(Joi.ref("password"))
            .required()
            .label("Confirm password")
            .messages({ "any.only": "{{#label}} does not match" }),
    });
    return schema.validate(data);
};

module.exports = {
    registerValidation,
    loginValidation,
    resetPasswordValidation,
};
