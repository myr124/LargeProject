const { follow } = require('../controllers/socialController');

jest.mock('../models/follow');
jest.mock('../models/user');

const Follow = require('../models/follow');
const User   = require('../models/user');

function mockRes() {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json   = jest.fn().mockReturnValue(res);
    return res;
}

describe('follow controller (unit)', () => {
    afterEach(() => jest.clearAllMocks());

    test('saves a follow record, increments both counters, and returns 201', async () => {
        const saveMock = jest.fn().mockResolvedValue({});
        Follow.mockImplementation(() => ({ save: saveMock }));
        User.findByIdAndUpdate = jest.fn().mockResolvedValue({});

        const req = { body: { follower_id: 'userA', following_id: 'userB' } };
        const res = mockRes();

        await follow(req, res);

        expect(saveMock).toHaveBeenCalledTimes(1);
        expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
            { _id: 'userA' }, { $inc: { followingCount: 1 } }
        );
        expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
            { _id: 'userB' }, { $inc: { followerCount: 1 } }
        );
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ message: 'Followed successfully' });
    });

    test('returns 500 when the database throws an error', async () => {
        const saveMock = jest.fn().mockRejectedValue(new Error('DB failure'));
        Follow.mockImplementation(() => ({ save: saveMock }));

        const req = { body: { follower_id: 'userA', following_id: 'userB' } };
        const res = mockRes();

        await follow(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'DB failure' });
    });
});
