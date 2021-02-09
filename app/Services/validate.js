const base = require('../Database/connection')

async function  validate(reqBody ,rules){
    let errorMess = {}  
    for(const key in rules){ //const i=0 ; i< rules.length; i++
        // console.log(i, rules[i].rule)
        const value = rules[key]

        console.log(value)
        const valueArray = value.split('|')  //separate word from values
        let errorValidate = []
        for(const i in valueArray){
            const rule = valueArray[i]
            const inputValue = reqBody[key]
            if(rule === 'require'){
                if(inputValue === ''|| inputValue === null || inputValue === undefined){
                    const message = key + ' Please full in this fill'                  
                    errorValidate.push(message)
                }
            }
            else if(rule === 'email'){
                const regex = /\S+@\S+\.\S+/
                if(!regex.test(inputValue)){
                    const message = key + ' email invalid'
                   
                    errorValidate.push(message)
                }
            }
            else if(rule.includes('min')){
                const minChar = rule.split(':')[1] //call array at 1 with key
                console.log(minChar)
                //const [min,minChar2] = rule.split(':') another way to write it's can show all of array.
                if(inputValue.length < minChar){
                    const message = key + ' min charecter much be ' + minChar
                    errorValidate.push(message)
                } 
            }
            else if(rule.includes('max')){
                const maxChar = rule.split(':')[1] //call array at 1 with key
                console.log(maxChar)
                //const [min,minChar2] = rule.split(':') another way to write it's can show all of array.
                if(inputValue.length > maxChar){
                    const message = key + ' max charecter much be ' + maxChar
                    errorValidate.push(message)
                }
            } 
            else if(rule === 'number'){
                const regex = /^\d+$/
                if(!regex.test(inputValue)){
                    const message = key + ' allow number only'
                   
                    errorValidate.push(message)
                }
            }
            else if(rule.includes('unique')){
                const table = rule.split(':')[1] //call array at 1 with key
                const sql =  `SELECT COUNT(${key}) as total FROM ${table} WHERE ${key} = '${inputValue}'` // ` --> use for linking string with variable
                const data = await base.query(sql)
              
                if(data[0].total){ // add member to array
                    const message = key + ' already had ' + data[0].total
                    errorValidate.push(message)
                }
            }
            else if(rule === 'date'){
                const regex = /^\d{4}[./-]\d{2}[./-]\d{2}$/
                if(!regex.test(inputValue)){
                    const message = key + ' date invalid'
                   
                    errorValidate.push(message)
                }
            }  
            
        }
        if(errorValidate.length){
            errorMess[key] = errorValidate //add member to object
        }    
        
    }
    
    if(!Object.keys(errorMess).length) {  //use with object throw member object to object above
        return
    }

    throw { message: errorMess}
}
module.exports = validate
