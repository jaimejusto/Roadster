const rootController = {
    
    home (req, res){
        res.status(200).render("index");
    }
};

module.exports = rootController;