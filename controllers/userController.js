const {User} = require('../models')

module.exports = {
    async getUsers (req, res){
        try {
            const users = await User.find();
            res.json(users);
        } catch (err) {
            res.status(500).json({ message: 'Something went wrong!, users not retrieved', details: err });
        }
    },
    async createUser (req, res){
        try {
            const user = await User.create(req.body);
            res.json(user);
        } catch (error) {
            res.status(500).json({ message: 'Something went wrong!, user not created', details: error });
        }
    },
    async getOneUser (req, res){
        try {
            const user = await User.findOne({ _id: req.params.userId })
                .select('-__v')
                .populate('thoughts')
                .populate('friends');
    
            // if no user is found
            if (!user) {
                return res.status(404).json({ message: 'No user found with this id!' });
            }
            res.json(user);
        } catch (error) {
            res.status(500).json({ message: 'Something went wrong!, no user found', details: error });
        }
    },
    async updateUser (req, res){
        try {
            const user = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $set: req.body },
                { runValidators: true, new: true }
            );
            // if no user is found
            if (!user) {
                return res.status(404).json({ message: 'No user found with this id!' });
            }
            res.json(user);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Something went wrong!, user not updated', details: error });
        }
    },
    async deleteUser (req, res){
        try {
            const user = await User.findOneAndDelete({ _id: req.params.userId });

            // if no user is found
            if (!user) {
                return res.status(404).json({ message: 'No user found with this id!' });
            }
            // delete all thoughts associated with the user
            await Thought.deleteMany({ username: user.username });
            res.json({ message: 'User thoughts deleted!' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Something went wrong!, user not deleted', details: error });
        }
    },
    async addFriend (req, res){
        try {
            const user = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $addToSet: { friends: req.params.friendId } },
                { new: true }
            ).populate('friends');

            // if no user is found
            if (!user) {
                return res.status(404).json({ message: 'No user found with this id!' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Something went wrong!, friend not added', details: error });
        }
    },
    async removeFriend (req, res){
        try {
            const user = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $pull: { friends: req.params.friendId } },
                { new: true }
            ).populate('friends');

            // if no user is found
            if (!user) {
                return res.status(404).json({ message: 'No user found with this id!' });
            }
            res.json(user);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Something went wrong!, friend not deleted', details: error });
        }
    },
};