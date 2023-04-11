const getMatchedTalents = async (req, res) => {
    // const obj = JSON.parse(req.body.obj);
    console.log('hello');

    res.send('route oks');
    // try {
    //     if (email) {
    //         const response = await Remoforce.updateOne({ email }, obj, { upsert: true });
    //         res.status(200).send(response);
    //     } else {
    //         // fs.unlinkSync(req.file.path);
    //         res.status(404).send({ message: 'something' });
    //     }
    // } catch (error) {
    //     // fs.unlinkSync(req.file.path);
    //     res.status(500).send({
    //         message: error.message,
    //     });
    // }
};
module.exports = {
   
    getMatchedTalents,
};
