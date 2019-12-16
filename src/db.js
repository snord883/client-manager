import PouchDB from 'pouchdb';

export default class DB{
    constructor(name){
        this.db = new PouchDB(name);
    }

    async getAllClients(){
        let allClients = await this.db.allDocs({include_docs: true});
        let clients={};

        allClients.rows.forEach(client => clients[client.id]=client.doc);

        return clients;
    }
}
