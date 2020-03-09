

module.exports ={
    authorizeOnlySelf,
    authorizeOnlyToCompanyOwner,
    authorizeOnlyToCompanyMembers
}


function authorizeOnlyToCompanyMembers(req,res, next) {
    //check for company members only.

    const isMember = req.resources.company.members.find((member) => {
        return member.toString() === req.userData.userId.toString();
    })

    if(!isMember) {
        return res.status(403).json({
            message: 'Unauthorized'
        })
    }

    next();
}

function authorizeOnlyToCompanyOwner(req, res, next) {
    const isOwner = req.resources.company.owner.toString() === req.userData.userId.toString();

    if(!isOwner) return res.status(403).json({ message : 'Unauthorized'})
    next();
}

function authorizeOnlySelf(req, res, next) {
    const isSelf = req.resources.user._id.toString() == req.userData.userId.toString();
    if(!isSelf){
         return res.status(403).json({
             message: 'Unauthorized'
         });
    }

    next();
}