plant mood = "sunny"
plant limit = 3
plant count = 0

breeze (mood == "sunny") softly {
  sparkle "time to bask in the sunlight"
}

breeze (mood == "rainy") softly {
  sparkle "let's listen to the raindrops"
}

bloom (count < limit) softly {
  sparkle count
  plant count = count + 1
}

