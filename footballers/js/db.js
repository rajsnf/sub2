let dbPromised = idb.open("footballersdb", 1, function (upgradeDb) {
    let teamsObjectStore = upgradeDb.createObjectStore("teams", {
        keyPath: "ID"
    });
    teamsObjectStore.createIndex("name", "name", { unique: false });
});
function favorit(team) {
    dbPromised
        .then(function (db) {
            let tx = db.transaction("teams", "readwrite");
            let store = tx.objectStore("teams");
            console.log(team);
            store.add(team.name);
            return tx.complete;
        })
        .then(function () {
            console.log("Berhasil menambahkan team favorit!");
        });
}