/*!
 * This work (css sources) is licensed under the Creative Commons Attribution-Noncommercial-No Derivative Works 3.0 Unported License.
 * 이 css 저작물은 크리에이티브 커먼즈 저작자 표시-비영리-변경 금지 3.0 Unported 라이선스에 따라 이용할 수 있습니다.
 * http://creativecommons.org/licenses/by-nc-nd/3.0/
 * Copyrightⓒ By numbernori.

 * @Author: Young Hyun Lee (2016-07-23)
 * @Version : 1.0.1(Last Version Date : 2016-07-23)
 */
(function(){
  var ctmDropdownBox = (function() {
    var defaultOpts = {
      placeholder: '', // String - 선택된 값이 없을 때 기본값으로 넣어주는 요소.
      width: null, // String - selectbox의 너비값. 없으면 자체 select만큼 너비가 늘어남. css상 기본 너비는 100. 수정되면 코드도 수정필요.
      height: null, // String - selectbox의 높이값. 없으면 css상의 기본값을 가짐.
      maxWidth: null, // String - 펼쳐지는 div의 최대 너비
      maxHeight: null, // String - 펼쳐지는 div의 최대 높이
      buttonTextAlign: '', // String - selectbox의 button의 텍스트 정렬. ('left', 'right', 'center' 등...)
      listTextAlign: '', // String - selectbox 버튼 클릭시 펼쳐지는 list의 텍스트 정렬. buttonTextAlign와 동일.
      theme: "", // theme
      multiple: false, // 지금은 없지만 추가할 기능(검토 후)
      single: true, // 지금은 없지만 추가할 기능(검토 후)
      selectAll: false, // 지금은 없지만 추가할 기능(검토 후)

      callback: function () {
      } // 지금은 없지만 추가할 기능(검토 후)
    };

    var me = {
      countList: {
        name: 'ctmDropdownBox',
        num: 1,
        lastOpenEle: null
      },
      blurEvent: null,
      init: function (ele, options) {
        var _options = defaultOpts,
          $ele = $(ele), useOptions = {},
          $parent = $ele.parent(), eleInd = $ele.index(),
          drawEle;
        $.extend(useOptions, _options, options);

        if (!$ele || $ele.length === 0) {
          return false;
        }
        for (var i = 0, list = $ele, len = list.length, nowEle, viewList, selectedEle, wrapperEle; i < len; i += 1) {
          nowEle = $(list[i]);
          if (nowEle.hasClass('select_box')) {
            drawEle = me.reDraw(nowEle, useOptions);
            drawEle.element[0].ctmSelectBoxOptions = useOptions;
            wrapperEle = $('#' + drawEle.wrapId);
          } else {
            drawEle = me.draw(nowEle, useOptions);
            drawEle.element[0].ctmSelectBoxOptions = useOptions;
            $(drawEle.element).replaceAll(nowEle);
            wrapperEle = $('#' + drawEle.wrapId);
            viewList = wrapperEle.find('.select_viewList_area');
            selectedEle = viewList.find('.selected');
            if (selectedEle.index() > 5) {
              viewList.scrollTop(selectedEle.offset().top - viewList.offset().top - viewList.height() / 2);
            }
            wrapperEle.removeClass('initSelectBox');
          }
          me.bindEvent(wrapperEle);
        }

        return me.returnValues;
      },
      // 모바일 체크용입니다. 간단하게 체크하고 있으므로, 원하시는 체크 방법에 따라 이 부분은 변경하시면 됩니다.
      checkMobile: function (callback) {
        var mobileInfo = ['Android', 'iPhone', 'iPod', 'BlackBerry', 'Windows CE', 'SAMSUNG', 'LG', 'MOT', 'SonyEricsson'];
        for (var info in mobileInfo) {
          if (navigator.userAgent.match(mobileInfo[info]) != null) {
            return true;
          }
        }
        return false;
      },
      checkName: function () {

      },
      reDraw: function (ele, useOptions) {
        var $ele = ele, cloneEle = $ele.clone(true),
          selectedOpt, checkSelected, nowUseClass = cloneEle.attr('id'),
          _parent = $ele.parents('.ctm_select_box');

        checkSelected = cloneEle.find('option:selected')[0];
        selectedOpt = checkSelected && checkSelected.attributes.getNamedItem('selected') ? cloneEle.find('option:selected') : cloneEle.find('option').eq(0);

        // 데이터 뿌려줌.
        _parent.find('.now_select_text').html(selectedOpt.text());
        _parent.find('.select_viewList_area ol').html(me.drawList({
          cloneSelectEle: cloneEle,
          nowUseClass: nowUseClass,
          opts: cloneEle.find('option')
        }))

        return {element: _parent, wrapId: nowUseClass + '_wrap', selectEle: ele};
      },
      draw: function (ele, useOptions) {
        var _me = me, wrapperAttr = '', nowSelectTextAttr = '', selectViewListAttr = '',
          selectEle = $(ele), cloneSelectEle = selectEle.clone(true),
          opts = cloneSelectEle.find('option'), selectedOpt = null, checkSelected,
          totalText = '', fragEle = $(document.createDocumentFragment()),
          lastCount = _me.countList, nowUseClass = '',
          selectEleId = selectEle.attr('id');

        checkSelected = cloneSelectEle.find('option:selected')[0];
        selectedOpt = checkSelected && checkSelected.attributes.getNamedItem('selected') ? cloneSelectEle.find('option:selected') : null;

        // selectbox에 id가 있으면 그 값을 기준으로 name등을 만듦. 없으면 default값으로 처리.
        if (selectEleId !== undefined) {
          nowUseClass = selectEleId;
        } else if (lastCount.num === 1) {
          nowUseClass = lastCount.name + '1';
          _me.countList.num = 2;
        } else {
          nowUseClass = lastCount.name + (lastCount.num + 1);
          _me.countList.num += 1;
        }

        // 중요 markup 들의 attribute 정의.
        wrapperAttr += ' id=' + nowUseClass + '_wrap';
        wrapperAttr += ' class="ctm_select_box ' + useOptions.theme + (me.checkMobile() === true ? ' mobileSelectBox' : '') + '" style="';
        for (var i = 0, list = [useOptions.width, useOptions.height], nameList = ['width', 'height'], len = list.length, nowList, nowValue = ''; i < len; i += 1) {
          nowList = list[i];
          if (nowList) {
            nowValue = (nowList.indexOf('px') > -1 ? nowList : nowList + 'px' );
            wrapperAttr += nameList[i] + ':' + nowValue + ';';
            // width의 값이 100보다 작을 경우(css의 최소너비값) min-width를 변경하도록 한다.
            if (i === 0 && nowList < 100) {
              wrapperAttr += 'min-width:' + nowValue + ';';
            }
          }
        }
        wrapperAttr += '"';

        nowSelectTextAttr += useOptions.buttonTextAlign + '';
        selectViewListAttr += useOptions.listTextAlign + '';

        // noData를 넣기위한 추가.
        if (opts.length === 0) {
          cloneSelectEle.append('<option>No Data</option>');
        }
        totalText +=
          '<div' + wrapperAttr + '>' +
            '<button type="button" class="fire_btn" title="목록 선택하기">' +
              '<span class="now_select_text ' + nowSelectTextAttr + '">' + (selectedOpt ? selectedOpt.html() : useOptions.placeholder) + '</span>' +
            '</button>' +
            '<div class="select_viewList_area ' + selectViewListAttr + '">' +
              '<ol>' +
              (
                opts.length === 0 ?
                  me.drawList({cloneSelectEle: cloneSelectEle, nowUseClass: nowUseClass, opts: null}) :
                  me.drawList({cloneSelectEle: cloneSelectEle, nowUseClass: nowUseClass, opts: opts})
              ) +
              '</ol>' +
            '</div>' +
          '</div>';

        if (opts.length === 0) {
          cloneSelectEle.find('option').remove();
        }

        fragEle.append(totalText);
        fragEle.find('.ctm_select_box').append(cloneSelectEle.addClass('select_box').attr('id', nowUseClass));

        return {element: fragEle.children().addClass('initSelectBox'), wrapId: nowUseClass + '_wrap', selectEle: ele};
      },
      drawList: function (data) {
        var totalText = '',
          _nowUseClass = data.nowUseClass,
          _opts = data.opts ? data.opts : data.cloneSelectEle.find('option');

        for (var i = 0, list = data.cloneSelectEle.find('option'), len = list.length, nowData, nowOptEle, viewListClassName = '', inputAttr = '', inputAttrList = ''; i < len; i += 1) {
          nowData = list[i];
          if (data.opts === null) {
            totalText +=
              '<li class="select_viewList noData">' +
                '<span class="value">' + _opts.eq(i).html() + '</span>' +
              '</li>';
            return totalText;
          }
          viewListClassName = 'acc_' + _nowUseClass + i;
          inputAttr = _opts[i].attributes;
          inputAttrList = '';
          for (var j = 0, jList = inputAttr, jLen = jList.length, nowAttrObj, isSelected = ''; j < jLen; j += 1) {
            nowAttrObj = jList[j];
            if (nowAttrObj.name === 'selected') {
              isSelected = ' selected';
              inputAttrList += ' checked="checked"';
            } else {
              inputAttrList += ' ' + nowAttrObj.name + '=' + nowAttrObj.value;
            }
          }
          totalText +=
            '<li class="select_viewList' + isSelected + '">' +
              '<label class="viewList_label" for="' + viewListClassName + '">' +
                '<input type="radio" class="viewList_input" name="' + _nowUseClass + '" id="' + viewListClassName + '" ' + inputAttrList + '>' +
                '<span class="value">' + _opts.eq(i).html() + '</span>' +
              '</label>' +
            '</li>';
        }
        return totalText;
      },
      bindEvent: function (ele) {
        var clickChangeEventFunc = function (e, clickEle) {
            var _this = $(clickEle),
              _parent = _this.parents('.ctm_select_box'),
              selectBox = _parent.find('.select_box'),
              selectViewListArea = _parent.find('.select_viewList_area'),
              nowEle = _this.parents('.select_viewList'),
              prevEle = _parent.find('.select_viewList.selected'),
              nowInd = 0, prevInd;
            if (nowEle == undefined) {
              return false;
            }

            nowInd = nowEle.index();
            prevInd = prevEle ? prevEle.index() : undefined;

            // 기본 동작들.
            _parent.removeClass('viewOn mViewOn');
            selectBox.find('option').eq(prevInd).removeAttr('selected');
            selectBox.find('option').eq(nowInd).prop('selected', true);
            prevEle.removeClass('selected');
            nowEle.addClass('selected');
            _parent.find('.now_select_text').html(nowEle.find('.value').html());

            if (me.checkMobile() === false) {
              // chenge Event를 실행.
              selectBox.trigger('change');
            }
          },
          blurEventFunc = function () {
            var _target = me.countList.lastOpenEle ? me.countList.lastOpenEle.parents('.ctm_select_box') : $('.ctm_select_box');
            _target.removeClass('viewOn mViewOn');
          };

        // label 클릭됐을 때
        ele.find('.viewList_label').off('mousedown').on('mousedown', function (e) {
          clearTimeout(me.blurEvent);
          me.countList.lastOpenEle = null;
          clickChangeEventFunc(e, this);
        });
        // 모바일 등에서 사용될 selecBox change 이벤트 바인딩.
        if (me.checkMobile() === true) {
          ele.find('.select_box').off('change').on('change', function (e) {
            var _parent = $(this).parents('.ctm_select_box'),
              selectedInd = _parent.find('.select_box option:selected').index();
            clickChangeEventFunc(e, _parent.find('.select_viewList_area .select_viewList').eq(selectedInd).find('.viewList_label'));
          });
        }

        // blur시 처리
        ele.find('.fire_btn').off('blur').on('blur', function () {
          me.countList.lastOpenEle = $(this);
          me.blurEvent = setTimeout(blurEventFunc, 100);
        });

        // selectBox를 펼칠 때
        ele.find('.fire_btn').off('click').on('click', function (e) {
          var _parent = $(this).parent(), totalLen = 0;

          // 모바일이라면 기본으로 처리.
          if (me.checkMobile() === true) {
            if (_parent.hasClass('mViewOn')) {
              _parent.removeClass('mViewOn');
              return _parent.find('.select_box').attr('size', totalLen);
            } else {
              _parent.addClass('mViewOn');
              totalLen = _parent.find('.select_box').children().length;
              _parent.find('.select_box').attr('size', totalLen);
              return _parent.find('.select_box').focus().click();
            }
          }

          if (_parent.hasClass('viewOn')) {
            _parent.removeClass('viewOn');
          } else {
            _parent.addClass('viewOn');
          }
        });

      },
      // 반환시킬 함수, 값
      returnValues: {
        $el: null,
        eleStyles: {
          isOverflowList: false // 이 셀렉트박스의 요소들이 많아서 스크롤이 필요한지 여부 체크.
        },
        init: function (options) {
          me.returnValues.$el = this;
          return me.init(this, options);
        }
      }

    };

    return me.returnValues;
  }());

  $.fn.ctmDropdownBox = ctmDropdownBox.init;
}());



