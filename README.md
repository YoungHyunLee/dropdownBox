# dropdownBox

A simple custom dropdown menu. made by Young Hyun Lee & numbernori & Javascript.

JS로 만들어진 심플한 dropdown 입니다.
만든이 : 이용현 & numbernori & JS.

## Confition

This component is working in IE 9, 10, 11 & chrome & mobile... and so on.

이 컴포넌트는 ie 9이상 또는 모바일 그리고 일반 메이저 브라우저에서 동작합니다.

(모바일 체크에 대해서는 js를 참고하세요. 원하는 조건대로 모바일을 체크할 수 있습니다.)

## How to Using

```html
<link href="./resources/css/common.css" rel="stylesheet" type="text/css" />
<script src="./resources/js/jquery-3.1.0.min.js"></script> // or 2.0.0 upper. 2.0.0 버전 이상이라면 크게 상관없습니다.
<script src="./resources/js/ctmDropdownBox.js"></script>

...
<select id="isItSelect">
  <option data-myValue="1" selected="selected">test my msg1</option>
  <option data-myValue="2">test my msg2</option>
  <option data-myValue="3">test my msg3</option>
  <option data-myValue="4">test my msg4</option>
  <option data-myValue="5">test my msg5</option>
  <option data-myValue="6">test my msg6</option>
</select>
```

and

```js
var $mySelectBox = $('#isItSelect');
// select에 change 이벤트를 적용시켜주시면, 일반적인 select처럼 동작합니다.
$mySelectBox.on('change', function(){
  alert('날 클릭했냐옹!!!');
});

// FIRE!!
$mySelectBox.ctmDropdownBox({width : '200', maxHeight : '200'});

```

If you want more example, see *index.html*.

더 많은 예제를 원하시면, index.html을 참고해주세요.

## License

This work (css sources) is licensed under the Creative Commons Attribution-Noncommercial-No Derivative Works 3.0 Unported License.

이 css 저작물은 크리에이티브 커먼즈 저작자 표시-비영리-변경 금지 3.0 Unported 라이선스에 따라 이용할 수 있습니다.

http://creativecommons.org/licenses/by-nc-nd/3.0/

Copyrightⓒ By numbernori.

@Author: Young Hyun Lee (2016-07-23)

@Version : 1.0.1(Last Version Date : 2016-07-23)

