'use strict';

module.exports = {
    async up(knex) {
        const columns = await knex.raw('SHOW COLUMNS FROM user');
        const existingColumns = columns[0].map(col => col.Field);
        const columnsToAdd = ['email', 'username', 'password'].filter(col => !existingColumns.includes(col));
        
        if (columnsToAdd.length > 0) {
            await knex.schema.alterTable('user', (table) => {
                columnsToAdd.forEach(col => {
                    table.string(col).notNull();
                });
            });
        }
    },

    async down(knex) {
        const columns = await knex.raw('SHOW COLUMNS FROM user');
        const existingColumns = columns[0].map(col => col.Field);
        const columnsToRemove = ['email', 'username', 'password'].filter(col => existingColumns.includes(col));

        if (columnsToRemove.length > 0) {
            await knex.schema.alterTable('user', (table) => {
                columnsToRemove.forEach(col => {
                    table.dropColumn(col);
                });
            });
        }
    }
};
