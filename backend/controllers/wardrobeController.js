const vision = require('@google-cloud/vision');
const WardrobeItem = require('../models/WardrobeItem');

// Initialize the Google Cloud Vision client
const client = new vision.ImageAnnotatorClient();

/**
 * A helper function to analyze an image buffer and extract relevant clothing labels.
 * @param {Buffer} buffer - The image file buffer.
 * @returns {Promise<Object>} An object containing detected type, color, and tags.
 */
const analyzeImage = async (buffer) => {
    try {
        const [result] = await client.labelDetection(buffer);
        const labels = result.labelAnnotations.map(label => label.description.toLowerCase());
        
        console.log('Detected labels:', labels);

        const clothingTypes = ['shirt', 't-shirt', 'jeans', 'trousers', 'pants', 'jacket', 'dress', 'skirt', 'sweater', 'hoodie', 'footwear', 'shoe'];
        const colorKeywords = ['blue', 'black', 'white', 'red', 'green', 'yellow', 'gray', 'brown', 'pink', 'purple', 'orange'];

        let detectedType = 'unknown';
        let detectedColor = 'unknown';

        for (const label of labels) {
            if (clothingTypes.includes(label)) {
                detectedType = label;
                break;
            }
        }

        for (const label of labels) {
            if (colorKeywords.includes(label)) {
                detectedColor = label;
                break;
            }
        }
        
        if (detectedType === 'unknown' && labels.includes('clothing')) {
            detectedType = 'clothing';
        }

        return {
            itemType: detectedType,
            color: detectedColor,
            tags: labels
        };

    } catch (error) {
        console.error('ERROR in Google Vision API:', error);
        throw new Error('Failed to analyze image with Vision API.');
    }
};

/**
 * @desc    Upload an image, analyze it, and create a new wardrobe item
 * @route   POST /api/wardrobe/upload
 * @access  Private
 */
exports.uploadWardrobeItem = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Please upload an image file.' });
        }
        
        // --- CHANGE 1: Get userId from the request body ---
        // The frontend will now send the user's Firebase UID in the form data.
        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({ message: 'User ID is required.' });
        }

        const imageBuffer = req.file.buffer;

        const analysisResult = await analyzeImage(imageBuffer);

        // In a production app, you would upload this buffer to a cloud storage service
        // (like Firebase Storage or AWS S3) and get a real URL.
        const imageUrl = `https://placehold.co/300x400/EBF2FA/737373?text=${analysisResult.itemType}`;

        const newItem = await WardrobeItem.create({
            userId, // Use the real userId from the request
            itemType: analysisResult.itemType,
            color: analysisResult.color,
            imageUrl,
            tags: analysisResult.tags,
        });

        res.status(201).json({
            success: true,
            message: 'Item added to wardrobe successfully!',
            data: newItem,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during item upload.' });
    }
};

/**
 * @desc    Get all wardrobe items for a specific user
 * @route   GET /api/wardrobe
 * @access  Private
 */
exports.getWardrobeItems = async (req, res) => {
    try {
        // --- CHANGE 2: Get userId from the query parameters ---
        // The frontend will send the ID in the URL, like: /api/wardrobe?userId=...
        const { userId } = req.query;
        if (!userId) {
            return res.status(400).json({ message: 'User ID is required.' });
        }

        const items = await WardrobeItem.find({ userId: userId });

        res.status(200).json({
            success: true,
            count: items.length,
            data: items,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while fetching items.' });
    }
};
