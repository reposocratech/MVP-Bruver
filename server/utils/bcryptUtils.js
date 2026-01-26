import bcrypt from 'bcrypt'

export const compareString = async(str, hash)=>{
    return await bcrypt.compare(str, hash) 
}