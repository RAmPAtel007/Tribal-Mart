const https = require('https');

const ids = [
    "1611077544837-18376483cc7f", // Wooden/Basket
    "1525974160448-028bb4b9d032", // Bead
    "1558021211-6d1403321394", // Weaving
    "1610701596007-11502861dcfa", // Pottery
    "1588665798950-5d6e2f1950e3", // Basket/Textile
    "1528255651608-54cde266395b", // Pattern/Fabric
    "1513519245088-0e12902e5a38", // Sculpture
    "1606240724602-5b21f896eae8", // Handmade bowl
    "1596070857348-15cdb45e2278", // Tribal mask/art
    "1567113463300-102a922b2700", // Woven rug
    "1550989460-0adf9ea622e2", // broken?
    "1646218738596-3c224213d289", // African crafts
    "1600898517208-fc768406fd27", // Loom/weaving
    "1615873968403-f938a165fc34"  // Pottery making
];

async function check() {
    for (let id of ids) {
        const url = `https://images.unsplash.com/photo-${id}?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80`;
        try {
            await new Promise((resolve) => {
                https.get(url, (res) => {
                    console.log(`${id}: ${res.statusCode}`);
                    resolve();
                });
            });
        } catch (e) {
            console.log(`${id}: ERROR`);
        }
    }
}
check();
