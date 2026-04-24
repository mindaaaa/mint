<div align="center">

![header](https://capsule-render.vercel.app/api?type=waving&color=0:90EE90,50:98FB98,100:ADFF2F&height=200&section=header&text=MINT&fontSize=90&fontColor=ffffff&animation=twinkling&fontAlignY=40&desc=Minda's%20Interpreted%20Natural%20Tongue&descAlignY=70&descAlign=60)

</div>

<div align="center">

> **A soft-spoken language for expressing life, feeling, and flow.**  
> You don't write code in MINT. **You whisper it.**

</div>

<!--
  🎬 DEMO VIDEO · HERO LOOP
  길이   : 10~15초 (muted autoplay / GIF)
  내용   : drawer 클릭 → 에디터 로드 → ▸ bloom → 🌼×3 + thank you → 루프
  파일   : docs/demo/hero.gif  (or hero.mp4)
  교체법 : 아래 <img> 태그를 새 데모 파일 경로로 바꾸기 (Pinterest gif 대체)
-->
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

## 🚀 Try it Online

**웹 플레이그라운드에서 바로 체험해보세요!**

👉 **[https://mint-woad.vercel.app/](https://mint-woad.vercel.app/)**

<!--
  🎬 DEMO VIDEO · 메인 전체 플로우 (포트폴리오 핵심)
  길이   : 1:45 ~ 2:00
  내용   : 첫 인상 → 예제 선택 → bloom → 라이브 편집 →
           낙엽(에러) → walk 튜토리얼 → glossary → 정리
  파일   : docs/demo/walkthrough.mp4  (or 썸네일 poster + 유튜브 링크)
  삽입예 :
    <video src="docs/demo/walkthrough.mp4" controls width="1000" poster="docs/demo/poster.png"></video>
    또는
    [![walkthrough](docs/demo/poster.png)](https://youtu.be/XXXX)
-->

웹 브라우저에서 MINT 코드를 작성하고 실행할 수 있습니다.
예제 드로어에서 씨앗 하나를 골라 `▸ bloom` 버튼으로 피워보세요.

> [!NOTE]  
> 웹 플레이그라운드 사용법과 명령어 가이드는 [Web Playground Guide](https://github.com/mindaaaa/mint/wiki/Web-Playground-Guide) 위키에서 확인하세요.

---

## 🪴 Quick Start

### 웹에서 시작하기 (추천)

1. [웹 플레이그라운드](https://mint-woad.vercel.app/) 접속
2. 좌측 드로어에서 씨앗(예제) 하나 선택 — 또는 빈 밭에서 시작
3. 우측 상단 `▸ bloom` 클릭 → 결과가 우측 패널에 피어남

> [!Tip]  
> 웹 플레이그라운드에서는 설치 없이 바로 MINT를 체험할 수 있습니다.  
> 자세한 사용법과 예제는 [Web Playground Guide](https://github.com/mindaaaa/mint/wiki/Web-Playground-Guide) 위키를 참고하세요.

### CLI로 시작하기

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

#### CLI 사용법

- `mint run <file.mint>`: 지정한 스크립트를 실행합니다.
- `mint version`: CLI 버전을 출력합니다.

> [!Tip]  
> 로컬 개발 환경에서는 먼저 `npm run build`를 수행한 뒤 <br>`npx mint run examples/hello.mint`처럼 실행할 수 있습니다. <br>`npm start -- <command>` 형태로도 동일하게 사용할 수 있습니다.

#### 예제 스크립트

- `examples/hello.mint`: 간단한 인사 출력
- `examples/conditional.mint`: 조건문과 반복문 흐름
- `examples/functions.mint`: 함수 선언과 호출
- `examples/errors.mint`: 런타임 에러 데모

#### 오류 예시

<!--
  🎬 DEMO VIDEO · R4 낙엽 3연타 (에러 → 고침 → 개화)
  길이 : 25~30초 GIF
  파일 : docs/demo/fallen.gif
  내용 : fallen-leaves 3종을 연속으로 "발생 → 수정 → 재개화" 시연
    1) parser stumble   bloom (3 < …) 조건 완성 + softly + 블록 닫기
    2) undefined        맨 위에 plant 로 이름 심기
    3) type mismatch    3 을 "3" 으로 따옴표 추가 (한 글자 수정)
  메시지 : "에러는 막다른 길이 아니라, 한 번 고쳐 다시 피우는 길"
  배치 : 아래 CLI 오류 출력과 나란히 — "CLI vs 웹" 에러 표현 비교
-->

```bash
mint run examples/errors.mint
```

```
🔥 Runtime Error
  at examples/errors.mint
  Undefined identifier "undefinedFeeling".
    details:
    {
      "name": "undefinedFeeling"
    }
  Hint: 실행 중인 값과 타입이 예상과 일치하는지 확인하세요.
```

> [!NOTE]  
> 렉서/파서 에러를 포함한 더 많은 예시와 상세한 가이드는 [위키](https://github.com/mindaaaa/mint/wiki)에서 확인할 수 있습니다.

---

## 문법 예시

<!--
  🎬 DEMO VIDEO · C-1 문법 타이핑 클로즈업 (8초 GIF)
  내용 : 빈 에디터에 한 줄씩 타이핑, 키워드가 green/amber/plum/clay로 피어오름
  파일 : docs/demo/syntax.gif
  배치 : 아래 mint 코드블록 바로 위에 삽입하면 live preview 느낌
-->

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

<!--
  🎬 DEMO VIDEO · R5 walk 챕터 전환
  길이 : 12초 GIF
  파일 : docs/demo/walk.gif
  내용 : 상단 `walk` 토글 → 우측 패널이 narration으로 전환 →
         챕터 1 "첫 씨앗" → nav `next →` → 챕터 2 "바람이 스치면"
  배치 : 키워드 표 바로 아래 — "이 키워드들을 어떻게 배우는지" 자연 연결
-->

---

## 기술 스택

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-C21325?style=flat-square&logo=jest&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white)
![CLI](https://img.shields.io/badge/CLI-000000?style=flat-square&logo=gnu-bash&logoColor=white)

---

## 더 알아보기

자세한 문서와 예제는 [위키](https://github.com/mindaaaa/mint/wiki)에서 확인하세요.

- [Web Playground Guide](https://github.com/mindaaaa/mint/wiki/Web-Playground-Guide) - 웹 플레이그라운드 사용 가이드 및 예제 모음
- [Getting Started](https://github.com/mindaaaa/mint/wiki/Getting-Started) - CLI 환경 시작하기 가이드
- [언어 가이드](https://github.com/mindaaaa/mint/wiki/%EC%96%B8%EC%96%B4-%EA%B0%80%EC%9D%B4%EB%93%9C) - 문법 상세 설명
- [에러 이해하기](https://github.com/mindaaaa/mint/wiki/%EC%97%90%EB%9F%AC-%EC%9D%B4%ED%95%B4%ED%95%98%EA%B8%B0) - 에러 처리 가이드

---

## 🌿 Status

**Season 0.1 — Sunlight Drift**  
_Currently in development_

---

## 👩‍💻 개발자

Made with 🌼 by [@mindaaaa](https://github.com/mindaaaa)

---

> _by you, for expression, emotion, and elegance._
