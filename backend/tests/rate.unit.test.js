const { rate } = require('../controllers/socialController');

jest.mock('../models/creation');
const Creation = require('../models/creation');

function mockRes() {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json   = jest.fn().mockReturnValue(res);
    return res;
}

describe('rate controller (unit)', () => {
    afterEach(() => jest.clearAllMocks());

    test('returns 400 when rating is greater than 5', async () => {
        const req = { body: { user_id: 'u1', post_id: 'p1', rating: 6 } };
        const res = mockRes();

        await rate(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Rating must be between 0 and 5' });
        expect(Creation.findByIdAndUpdate).not.toHaveBeenCalled();
    });

    test('updates the creation and returns 200 for a valid rating', async () => {
        Creation.findByIdAndUpdate = jest.fn().mockResolvedValue({});
        const req = { body: { user_id: 'u1', post_id: 'p1', rating: 4 } };
        const res = mockRes();

        await rate(req, res);

        expect(Creation.findByIdAndUpdate).toHaveBeenCalledWith(
            { _id: 'p1' },
            { $set: { rating: 4 } }
        );
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Rating updated successfully' });
    });
});
