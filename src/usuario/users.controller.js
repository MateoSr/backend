import getAllUsers from "./users.service.js"

async function getUsers(req,res) {
    try{
        const users = await getAllUsers()
        // if(users == 0){
        //     return res.status(404).json({message:"No se encontraron usuarios"})
        return res.status(200).json(users)
        }catch(error){
        return res.status(400).json({error:error.message})
    }
}
export default getUsers