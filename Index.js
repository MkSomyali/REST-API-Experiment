const express = require("express")
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());

let patients = new Object();
patients["98765345678"] = ["Mxolisi", "Zanezembe", "067 435, 5623"]
patients["34554345445"] = ["Samkelo", "Macingo", "069 572 4893"]

let records = new Object();
records["98765345678"] = "Status: Healthy"
records["34554345445"] = "Status: Slight Cold"

// Get patient medical records
app.get("/records", (req, res) => {
    
    // Verify patient exists
    if (records[req.headers.id] === undefined) {
        res.status(404).send({"msg":"Patient not found"})
        return;
    }

    // Verify ID matches First and last Name
    if(req.headers.firstname == patients[req.headers.id][0] && req.headers.lastname == patients[req.headers.id][1]){
    if (req.body.reasonforvisit == "medicalrecords") {
        // return medical records
        res.status(200).send(records[req.headers.id])
        return;
    }
    else { 
        // retuen error
        res.status(501).send({"msg":"Unable to complete request at this time: " + req.body.reasonforvisit})
        return;
    }
}
    else {
        res.status(401).send({"msg":"Firstname or Lastname didn't match ID"})
        return;
    }

    // Return Appropriate record
    res.status(200).send({"msg": "HTTP GET - SUCCESS!"})

});

// Create a new patient
app.post("/", (req, res) => {
    
    // Create patint in database
    patients[req.headers.id] = [req.headers.firstname, req.headers.lastname, req.headers.phone]
    res.status(200).send(patients)    
});

// Update existing patient phone number
app.put("/", (req, res) => {

     // Verify patient exists
     if (records[req.headers.id] === undefined) {
        res.status(404).send({"msg":"Patient not found"})
        return;
     }

     if (records[req.headers.id] === undefined) {
        res.status(404).send({"msg":"Patient not found"})
        return;
    }

    // Verify ID matches First and last Name
    if(req.headers.firstname == patients[req.headers.id][0] && req.headers.lastname == patients[req.headers.id][1]){
      // Update the phone number and return the patient record
      patients[req.headers.id] = [req.headers.firstname, req.headers.lastname, req.body.phone]
      res.status(201).send(patients[req.headers.id]);
      return;
    }
    else {
        res.status(401).send({"msg":"Firstname or Lastname didn't match ID. (Trying to update phone#)"})
        return;
    }

    // Make sure  
    res.status(200).send({"msg": "HTTP PUT - SUCCESS!"})
});

// Delete patient records
app.delete("/", (req, res) => {

        // Verify patient exists
        if (records[req.headers.id] === undefined) {
            res.status(404).send({"msg":"Patient not found"})
            return;
        }
    
        // Verify ID matches First and last Name
        if(req.headers.firstname == patients[req.headers.id][0] && req.headers.lastname == patients[req.headers.id][1]){
        // Delete patient and medical records from database

        delete patients[req.headers.id]
        delete records[req.headers.id]

        res.status(200).send({"msg": "Succesfully deleted."});
        return;
    }
        else {
            res.status(401).send({"msg":"Firstname or Lastname didn't match ID. (Trying to delete)"})
            return;
        }


});

app.listen(3000);