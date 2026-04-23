// 해바라기 밭이 피어납니다
plant row = 0

bloom (row < 3) softly {
  plant col = 0

  bloom (col < 5) softly {
    sparkle "🌻"
    plant col = col + 1
  }

  plant row = row + 1
}
