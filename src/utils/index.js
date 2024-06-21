const { Schema } = require("mongoose");

/**
 * Extend mongoose schema with a given parent schema object
 *
 * @param {Schema} childSchema - Mongoose child schema
 * @param {Schema} parentSchema - Mongoose parent schema
 *
 * @todo only apply fields from child schema to parent schema for now.
 * Recommended to add static methods once the schema is extended
 */
function extendSchema(childSchema, parentSchema) {
    // deep clone schema
    const cloneSchema = parentSchema.clone();

    // apply all fields from child schema
    cloneSchema.add(childSchema.obj);

    return cloneSchema;
}

module.exports = {
    extendSchema,
};