module.exports = {
    now : () => {
        const d = new Date();
        const year = d.getFullYear() ;
        const month = ("0" + (d.getMonth() + 1)).slice(-2);
        const date = ("0" + d.getDate()).slice(-2);
        const hours = ("0" + d.getHours()).slice(-2);
        const minutes = ("0" + d.getMinutes()).slice(-2);
        const seconds = ("0" + d.getSeconds()).slice(-2);
        const now = `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`
            
        return now
    }
}