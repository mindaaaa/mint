<div align="center">

![header](https://capsule-render.vercel.app/api?type=waving&color=0:90EE90,50:98FB98,100:ADFF2F&height=200&section=header&text=MINT&fontSize=90&fontColor=ffffff&animation=twinkling&fontAlignY=40&desc=Minda's%20Interpreted%20Natural%20Tongue&descAlignY=70&descAlign=60)

</div>

<div align="center">

> **A soft-spoken language for expressing life, feeling, and flow.**  
> You don't write code in MINT. **You whisper it.**

</div>

<img src="https://i.pinimg.com/originals/fc/9c/e5/fc9ce59ceff32d597144e47606325126.gif" alt="배너" width=1280>

## 🌼 What is MINT?

MINT는 감성적이고 생명력 있는 코딩 경험을 추구하는 커스텀 언어입니다.  
*코드는 자연처럼 피어나야 한다*는 철학 아래, **시적이고 유려한 문법**을 지향합니다.

> You don't write code in MINT.  
> **You whisper it.**

---

## ✦ 주요 특징

- `plant`, `bloom`, `sparkle` 같은 생명과 감정을 담은 키워드
- 감정, 흐름, 생명감을 중심으로 구성된 코드 스타일
- 읽고 쓰기 쉬운 구조, **문장처럼 흐르는 문법**

---

## 🪴 Quick Start

1. 설치
   ```bash
   npm install
   ```
2. 빠른 실행
   ```bash
   npm start -- run examples/hello.mint
   ```
   ```
   🌿 Result
     hello, mint!
   ```
3. 테스트
   ```bash
   npm test
   ```

### CLI 사용법

- `mint run <file.mint>`: 지정한 스크립트를 실행합니다.
- `mint version`: CLI 버전을 출력합니다.

> **Tip**  
> 로컬 개발 환경에서는 먼저 `npm run build`를 수행한 뒤 `npx mint run examples/hello.mint`처럼 실행할 수 있습니다. <br>`npm start -- <command>` 형태로도 동일하게 사용할 수 있습니다.

### 예제 스크립트

- `examples/hello.mint`: 간단한 인사 출력
- `examples/conditional.mint`: 조건문과 반복문 흐름
- `examples/functions.mint`: 함수 선언과 호출
- `examples/errors.mint`: 런타임 에러 데모

---

## 문법 예시

```mint
plant feeling = "gentle"
plant season = 0

breeze (feeling == "gentle") softly {
  sparkle "the breeze whispers softly"
}

bloom (season < 3) softly {
  sparkle season
  plant season = season + 1
}

petal greet(name) {
  sparkle "hello, " + name
  gift "🌼"
}
```

---

## 연산자

| 연산자 | 설명                  | 예시                                              |
| ------ | --------------------- | ------------------------------------------------- |
| `+`    | 덧셈 또는 문자열 결합 | `plant total = 1 + 2`, `sparkle "hello, " + name` |
| `-`    | 뺄셈                  | `plant diff = right - left`                       |
| `*`    | 곱셈                  | `plant area = width * height`                     |
| `/`    | 나눗셈                | `plant half = value / 2`                          |
| `==`   | 동등 비교             | `breeze (answer == 42) softly { ... }`            |
| `<`    | 미만 비교             | `bloom (count < limit) softly { ... }`            |

> [!Warning]
> 타입이 맞지 않는 연산을 시도하면 평가기에서 런타임 에러를 발생시킵니다.

---

## 키워드

| 키워드    | 기능      | 의미                                    |
| --------- | --------- | --------------------------------------- |
| `plant`   | 변수 선언 | 값을 심듯이 다룹니다                    |
| `sparkle` | 출력      | 감정을 담아, 빛나는 순간을 표현합니다   |
| `breeze`  | 조건문    | 조건이 바람처럼 스치면 반응합니다       |
| `bloom`   | 반복문    | 무언가가 자연스럽게 피어나듯 반복됩니다 |
| `petal`   | 함수 선언 | 꽃잎처럼 열리고 닫히며 기능을 만듭니다  |
| `gift`    | 반환      | 값을 건넵니다. 마치 선물을 전하듯       |
| `softly`  | 연결어    | 흐름을 잇는 말입니다                    |

---

## 기술 스택

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-C21325?style=flat-square&logo=jest&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white)
![CLI](https://img.shields.io/badge/CLI-000000?style=flat-square&logo=gnu-bash&logoColor=white)

---

## 더 알아보기

더 자세한 내용은 [설계 문서](../mint.md)를 참고하세요.

---

## 🌿 Status

**Season 0.1 — Sunlight Drift**  
_Currently in development_

---

## 👩‍💻 개발자

Made with 🌼 by [@mindaaaa](https://github.com/mindaaaa)

---

> _by you, for expression, emotion, and elegance._
