import mongoose from 'mongoose';

export default class DBConnection {
    #uri;

    constructor(uri) {
        this.#uri = uri;
    }

    connect() {
        const conn = mongoose.createConnection(this.#uri);
        conn.on('error', (err) => {
            console.log(err);
        });

        conn.on('connected', () => {
            console.log(`connected to ${this.#uri}`);
        });
        return conn;
    }
}
