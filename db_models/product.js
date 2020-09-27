class Product
{
    static insert(name, totalPrice, quantity, treatmentID, callback)
    {
        const db = require('./db').db.connect();

        db.serialize(function() {
            const query = `INSERT INTO product (name, quantity, total_price, treatment_id)
                            VALUES ('${name}', ${quantity}, ${totalPrice}, ${treatmentID})`;

            db.run(query, callback);
            
            db.close();
        });
    }
}

exports.Product = Product;