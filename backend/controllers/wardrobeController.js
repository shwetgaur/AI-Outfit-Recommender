const vision = require('@google-cloud/vision');
const WardrobeItem = require('../models/WardrobeItem');

// Initialize the Google Cloud Vision client
// This automatically uses the credentials from the .env file
const client = new vision.ImageAnnotatorClient();

/**
 * A helper function to analyze an image buffer and extract relevant clothing labels.
 * @param {Buffer} buffer - The image file buffer.
 * @returns {Promise<Object>} An object containing detected type, color, and tags.
 */
const analyzeImage = async (buffer) => {
    try {
        // Use the Vision API to detect labels in the image
        const [result] = await client.labelDetection(buffer);
        const labels = result.labelAnnotations.map(label => label.description.toLowerCase());
        
        console.log('Detected labels:', labels);

        // --- Simple Rule-Based Logic to Determine Item Type and Color ---
        // This is a basic implementation. You can make this much more sophisticated!
        const clothingTypes = ['shirt', 't-shirt', 'jeans', 'trousers', 'pants', 'jacket', 'dress', 'skirt', 'sweater', 'hoodie'];
        const colorKeywords = ['blue', 'black', 'white', 'red', 'green', 'yellow', 'gray', 'brown', 'pink', 'purple', 'orange'];

        let detectedType = 'unknown';
        let detectedColor = 'unknown';

        // Find the first matching clothing type from the labels
        for (const label of labels) {
            if (clothingTypes.includes(label)) {
                detectedType = label;
                break;
            }
        }

        // Find the first matching color from the labels
        for (const label of labels) {
            if (colorKeywords.includes(label)) {
                detectedColor = label;
                break;
            }
        }
        
        // If we couldn't find a specific type, we can fall back to a more general label.
        if (detectedType === 'unknown' && labels.includes('clothing')) {
            detectedType = 'clothing';
        }

        return {
            itemType: detectedType,
            color: detectedColor,
            tags: labels // We'll save all detected labels as tags
        };

    } catch (error) {
        console.error('ERROR in Google Vision API:', error);
        throw new Error('Failed to analyze image with Vision API.');
    }
};

/**
 * @desc    Upload an image, analyze it, and create a new wardrobe item
 * @route   POST /api/wardrobe/upload
 * @access  Private (we'll add auth later)
 */
exports.uploadWardrobeItem = async (req, res) => {
    try {
        // req.file is available thanks to multer. It contains the uploaded image info.
        if (!req.file) {
            return res.status(400).json({ message: 'Please upload an image file.' });
        }
        
        // For now, userId is hardcoded. Later, this will come from Firebase Auth token.
        const userId = 'temp-user-123'; 
        const imageBuffer = req.file.buffer;

        // Analyze the image using our helper function
        const analysisResult = await analyzeImage(imageBuffer);

        // For now, we'll use a placeholder for the image URL.
        // In a real app, you would upload the imageBuffer to a service like Firebase Storage
        // and get a public URL back.
        const imageUrl = `https://placehold.co/300x400?text=${analysisResult.itemType}`;

        // Create a new wardrobe item document in MongoDB
        const newItem = await WardrobeItem.create({
            userId,
            itemType: analysisResult.itemType,
            color: analysisResult.color,
            imageUrl, // Placeholder URL
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
 * @desc    Get all wardrobe items for a user
 * @route   GET /api/wardrobe
 * @access  Private (we'll add auth later)
 */
exports.getWardrobeItems = async (req, res) => {
    try {
        // For now, userId is hardcoded.
        const userId = 'temp-user-123';
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