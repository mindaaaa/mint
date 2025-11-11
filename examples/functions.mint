petal greet(name) {
  sparkle "hello, " + name
  gift "🌼"
}

petal repeatTimes(text, times) {
  plant count = 0

  bloom (count < times) softly {
    sparkle text
    plant count = count + 1
  }

  gift "🌻"
}

sparkle greet("mint whisperer")
sparkle repeatTimes("gentle breeze", 2)

