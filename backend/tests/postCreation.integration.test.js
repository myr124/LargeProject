const request  = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app      = require('../app');
const User     = require('../models/user');
const Creation = require('../models/creation');

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
}, 30000);

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

afterEach(async () => {
    await User.deleteMany({});
    await Creation.deleteMany({});
});

describe('POST /api/postCreation (integration)', () => {
    test('creates a creation, returns 201 with postId, and increments the author postCount', async () => {
        // Create a real user to act as author
        const user = await User.create({
            firstName: 'Test',
            lastName:  'Chef',
            email:     'chef@test.com',
            username:  'testchef',
            password:  'hashed_password',
        });

        const payload = {
            author_id:   user._id.toString(),
            title:       'Test Focaccia',
            description: 'A crispy, olive-oil-soaked focaccia.',
            ingredients: ['flour', 'water', 'olive oil', 'salt'],
            instructions: ['Mix ingredients', 'Let rise 2 hours', 'Bake at 450°F'],
            image_urls:  ['https://example.com/focaccia.jpg'],
            tags:        ['bread', 'italian'],
            self_rating: 5,
        };

        const res = await request(app)
            .post('/api/postCreation')
            .send(payload);

        // Response shape
        expect(res.status).toBe(201);
        expect(res.body.message).toBe('Creation posted successfully');
        expect(res.body.postId).toBeDefined();

        // Creation exists in DB with correct fields
        const creation = await Creation.findById(res.body.postId);
        expect(creation).not.toBeNull();
        expect(creation.title).toBe('Test Focaccia');
        expect(creation.ingredients).toEqual(['flour', 'water', 'olive oil', 'salt']);
        expect(creation.instructions).toHaveLength(3);

        // Author's postCount was incremented
        const updatedUser = await User.findById(user._id);
        expect(updatedUser.postCount).toBe(1);
    });
});
