const mongoose = require ('mongoose')
const Help = require('./Models/HelpSchema')



mongoose.connect('mongodb://127.0.0.1:27017/CommunityHelpBoard', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;      

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});



const sampleHelps = [
    {
        title: "Need Blood Donation",
        urgencylevel: "High",
        category: "Health",
        location: "New York",
        Tags: "Blood, Emergency, Hospital"
    },
    {
        title: "Looking for a Math Tutor",
        urgencylevel: "Medium",
        category: "Education",
        location: "Los Angeles",
        Tags: "Tutor, Math, Education"
    },
    {
        title: "Lost Pet - Help Needed",
        urgencylevel: "High",
        category: "Animal",
        location: "Chicago",
        Tags: "Lost, Pet, Dog"
    },
    {
        title: "Food Distribution for Homeless",
        urgencylevel: "Low",
        category: "Community",
        location: "San Francisco",
        Tags: "Food, Charity, Help"
    },
    {
        title: "Need Volunteers for Beach Cleanup",
        urgencylevel: "Medium",
        category: "Environment",
        location: "Miami",
        Tags: "Cleanup, Beach, Volunteer"
    }
];


Help.insertMany(sampleHelps)
.then ( data => {
    console.log(data)
}
)