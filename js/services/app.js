//
//postenService
//
app.service('postenService', function() {
    this.data = {items: [
            {tbPostenDate: new Date(2014, 9, 12),
                tbPostenText: "Tapezieren des Kellers",
                tbPostenProStd: 26.5,
                tbPostenStdAnz: 2},
            {tbPostenDate: new Date(2013, 9, 12),
                tbPostenText: "Weißeln des Wohnraums",
                tbPostenProStd: 9.5,
                tbPostenStdAnz: 12}
        ],
        customer: {name: "T.S. Dienstleistungen",
            street: "Nelkenweg 8",
            postalCode: "D-70922",
            city: "Marktreditz"},
        client: {name: "Wochenblatt GmbH",
            street: "Frankfurter Ring 239",
            postalCode: "D-80937",
            city: "München"}
    };
    this.setCustomer = function(customerObj) {
        this.data.customer = customerObj;
    };
    this.setClient = function(clientObj) {
        this.data.client = clientObj;
    };
    this.getCustomer = function() {
        return this.data.customer;
    };
    this.getClient = function() {
        return this.data.client;
    };
    this.getItems = function() {
        return this.data.items;
    };
    this.getItem = function(id) {
        return this.data.items[id];
    };
    this.appendItem = function(item) {
        var vd;//void
        vd = this.data.items.push(item);
        return vd;
    };
    this.changeItem = function(itemNr, item) {
        item = this.data.items[itemNr] = item;
        return item;
    };
    this.deleteItem = function(itemNumber) {
        return   this.data.items.splice(itemNumber, 1);
    };
    this.popItem = function() {
        this.data.items.pop();
    };
});