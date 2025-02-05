'use strict';

exports.up = async (knex) => {
    await knex.schema.createTable('movies', (table) => {
        table.increments('id').primary();
        table.string('title').notNullable();
        table.text('description').notNullable();
        table.date('releaseDate').notNullable();
        table.string('director').notNullable();
        table.timestamps(true, true);
    });

    await knex.schema.createTable('user_favorites', (table) => {
        table.increments('id').primary();
        table.integer('user_id').unsigned().references('id').inTable('user').onDelete('CASCADE');
        table.integer('movie_id').unsigned().references('id').inTable('movies').onDelete('CASCADE');
        table.unique(['user_id', 'movie_id']);
        table.timestamps(true, true);
    });
};

exports.down = async (knex) => {
    await knex.schema.dropTableIfExists('user_favorites');
    await knex.schema.dropTableIfExists('movies');
};
