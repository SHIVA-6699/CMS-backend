import LiveStream from "../../models/LiveStreamModels/livestream.model.js";

export const getActiveStreams = async (req, res) => {
  try {
    // Fetch the most recent active stream, sorted by the timestamp (createdAt or updatedAt)
    const latestStream = await LiveStream.findOne().sort({
      createdAt: -1,
    }); // Sort by createdAt in descending order to get the latest

    if (!latestStream) {
      return res.status(404).json({ message: "No active streams found" });
    }

    res.status(200).json({ latestStream, fetchedAt: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch live streams" });
  }
};


// Create a new live stream
export const createLiveStream = async (req, res) => {
  const { title, description, streamLink, thumbnail, isActive } = req.body;
  try {
    const newStream = new LiveStream({
      title,
      description,
      streamLink,
      thumbnail,
      isActive,
    });
    await newStream.save();
    res.status(201).json(newStream);
  } catch (error) {
    res.status(400).json({ error: "Failed to create live stream" });
  }
};


export const updateLiveStreamStatus = async (req, res) => {
  const { id } = req.params;
  const { isActive } = req.body;

  try {
    const liveStream = await LiveStream.findById(id);

    if (!liveStream) {
      return res.status(404).json({ message: "Live stream not found" });
    }

    liveStream.isActive = isActive; // Toggle the isActive status

    await liveStream.save(); // Save the updated live stream

    res.status(200).json(liveStream);
  } catch (error) {
    console.error("Error updating live stream:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
