const {Thought} = require('../models')

module.exports = {
    async getThoughts (req, res){
        try {
            const thoughts = await Thought.find();
            res.json(thoughts);
        } catch (err) {
            res.status(500).json({ message: 'Something went wrong! , thoughts not retrieved', details: err });
        }    
    },
    async createThought (req, res){
        try {
            const thought = await Thought.create(req.body);
            // find the user that created the thought
            await User.findOneAndUpdate(
                { _id: req.body.userId },
                { $push: { thoughts: thought._id } },
                { new: true }
            );
            res.json(thought);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Something went wrong!, thought not created', details: error });
        }
    },
    async getOneThought (req, res){
        try {
            const thought = await Thought.findOne({ _id: req.params.thoughtId });
            // if no thought is found
            if (!thought) {
                return res.status(404).json({ message: 'No thought found with this id!' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Something went wrong!, no thought found', details: error });
        }
    },
    async updateThought (req, res){
        try {
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $set: req.body },
                { runValidators: true, new: true } // new: true returns the updated thought
            );
            // if no thought is found
            if (!thought) {
                return res.status(404).json({ message: 'No thought found with this id!' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Something went wrong!, thought not updated', details: error });
        }
    },
    async deleteThought (req, res){
        try {
            const thought = await Thought.findOneAndDelete({ _id: req.params.thoughtId });
            // if no thought is found
            if (!thought) {
                return res.status(404).json({ message: 'No thought found with this id!' });
            }

            res.json({ message: 'Thought deleted!' });
        } catch (error) {
            res.status(500).json({ message: 'Something went wrong!, thought not deleted', details: error });
        }
    },
    async addReaction (req, res){
        try {
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $push: { reactions: req.body } },
                { new: true, runValidators: true }
            );

            if (!thought) {
                return res.status(404).json({ message: 'No thought found with this id!' });
            }
            res.json(thought);
        } catch (error) {
            res.status(500).json({ message: 'Something went wrong!, reaction not added', details: error });
        }
    },
    async removeReaction (req, res){
        try {
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $pull: { reactions: { reactionId: req.params.reactionId } } },
                { new: true }
            );

            if (!thought) {
                return res.status(404).json({ message: 'No thought found with this id!' });
            }
            res.json({ message: 'Reaction deleted!' });
        } catch (error) {
            res.status(500).json({ message: 'Something went wrong!, reaction not deleted', details: error });
        }
    }
}