/* sixUi.js */
(function(window, $, undefined){
	var sixUi = function(){
        this.body = null;
        this.header = null;
    };//sixUi

    sixUi.prototype = {
		init : function(){
			var that = this;
            
            that.idx();
            that.dataWidth();//dataWidth
            that.headers();//headers
            that.select(that.body);//selectbox
            that.chkbox(that.body);//chkbox
            that.radio(that.body);//radio
            that.trEdit(that.body);

            //sel_st3
            that.body.find('.sel_st3').on('click', function(){
            	var _this = $(this),
            		_has = _this.hasClass('open');
                if(!_this.hasClass('disabled')){
                	if(_has) _this.removeClass('open');
                	else{
                		that.openHide();
                		_this.addClass('open');
                	}
                }
            });

            //calendar
            $.each(that.body.find('.inp_calendar_st1'), function(){
                that.setDatePicker($(this).find('input'));
            });


            //scr chk
            var _h = that.body.height() - (that.body.find('.header').outerHeight(true) + that.body.find('#footer').outerHeight(true));
            that.body.find('#container').css('min-height', _h);
		},//init
        idx : function(){
            var that = this;
            
            that.body = $('body');
            that.header = $('.header');
        },//idx
        headers : function(){
            var that  = this,
                _hd_mv = false,
                _set_hide = null,
                _nav = that.header.find('.nav');
            
            that.header.on({
                mouseenter : function(){
                    _hd_mv = true;
                    
                    if(_set_hide !== null) clearTimeout(_set_hide);
                },
                mouseleave : function(){
                    _hd_mv = false;

                    _set_hide = setTimeout(function(){
                        if(!_hd_mv){
                             _nav.find('.on').removeClass('on');
                             _nav.find('.sub_d').hide();
                        }
                    }, 500);
                }
            });

            _nav.children('a').on({
                mouseenter : function(){
                    var _this = $(this),
                        _sub = _this.next('.sub_d');
                    
                    _this.addClass('on').siblings().removeClass('on');
                    _nav.find('.sub_d').hide();
                    if(_sub.length === 0) return false;                    
                    _this.next('.sub_d').css({
                        left : _this.offset().left
                    }).show();
                }
            });//_nav.children('a').on({
            
            //sh_form
            var _sh_form = that.body.find('.sh_form');
            if(_sh_form.length > 0){
                var _sh_hide = null;
                _sh_form.on({
                    mouseenter : function(){
                        _sh_mv = true;
                        
                        if(_sh_hide !== null) clearTimeout(_sh_hide);
                    },
                    mouseleave : function(){
                        _sh_mv = false;

                        _sh_hide = setTimeout(function(){
                            if(!_sh_mv) _sh_form.find('.open').removeClass('open');
                        }, 200);
                    }
                });
            }

        },//header
        skip : function(idx){
            document.getElementById(idx).tabIndex = -1;
            document.getElementById(idx).focus();
        },//skip
        dataWidth : function(){
			$.each($('[data-width]'), function(each_num, each_idx){
                var _this = $(each_idx),
                    _dataWidth = _this.attr('data-width'),
                	_num = _dataWidth.replace(/[^0-9]/g,''),
                	_tx = _dataWidth.replace(/[0-9]/g,'');
                
                _this.css({
                	width : _num+''+_tx
                }).removeAttr('data-width');
            });
		},//dataWidth
        trEdit : function(idx){
            var _edit = idx.find('[data-edit]');

            //[확인,수정] 버튼
            $.each(_edit, function(eachNum, eachThis){
                var _this = $(eachThis),
                    _type = _this.attr('data-edit'),//true(확인), cancell(취소), edit(수정), del(삭제)
                    _idx = _this.attr('data-idx'),
                    _parents = _this.parents(_idx);
                
                if(_type === 'edit' || _type === 'true' || _type === 'cancell'){//수정, 확인, 취소
                    _this.on({
                        click : function(){
                            _parents.toggleClass('edit_mode');

                            if(_type === 'true'){//input > tx
                                var _inp_edit = _parents.find('.inp_edit');
                                $.each(_inp_edit, function(eachNum2, eachThis2){
                                    var _this2 = $(eachThis2), 
                                        _inp = _this2.find('input[type="text"]'),
                                        _tx = _this2.children('.tx');
                                    
                                    _tx.text(_inp.val());
                                });
                            //if(_type === 'true'){
                            }else if(_type === 'cancell'){
                                var _inp_edit = _parents.find('.inp_edit');
                                $.each(_inp_edit, function(eachNum2, eachThis2){
                                    var _this2 = $(eachThis2), 
                                        _inp = _this2.find('input[type="text"]'),
                                        _tx = _this2.children('.tx');
                                    
                                    _inp.val(_tx.text());
                                });
                            }//}else if(_type === 'cancell'){
                        }
                    });
                //if(_type === 'edit' && _type === 'true'){    
                }else if(_type === 'del'){//삭제
                    _this.on({
                        click : function(){
                            _parents.remove();
                        }
                    });
                }
            });

        },//trEdit
        select : function(idx){
            /*
            select 기능
            */
            var that = this,
                _select = idx.parent().find('select'), 
                _thisMv = false,//enter,leave체크
                _cl = 'open',//open class
                _lg = _select.length;
            
            for(var i = 0; _lg > i; i++){
                var _for_this = _select.eq(i),
                    _id = _for_this[0].id,
                    _data = _for_this.data('txt'),
                    _data_change = _for_this.attr('data-change'),
                    _index = _for_this.find('option:selected').index();

                if(_index == -1){
                    _for_this.children('option').first().prop('selected', true);
                    _index = 0;
                }
                
                var _tx = (typeof _data === 'undefined') ? _for_this.children().eq(_index).text() : _for_this.children().eq(_index).val();
                idx.find('label[for='+_id+']').html(_tx);
                
                //change
                if(typeof _data_change === 'undefined'){
                    _for_this.attr('data-change', true).on({
                        change : function(){     
                            var _this = $(this),
                                _data = _this.data('txt'),
                                _tx = (typeof _data == 'undefined') ? _this.children('option:selected').text() : _this.children('option:selected').val() ;
                                _id = _this[0].id;
                                
                            idx.find('label[for='+_id+']').html(_tx);
                            
                            //inp_edit
                            var _inp_edit = _this.parents('.inp_edit');
                            if(_inp_edit.length > 0) _inp_edit.children('.tx').text(_tx);
                        }
                    });				
                }			
                
                _for_this.off('focus blur keyup mouseenter mouseleave').on({
                    focus : function(){
                    	that.openHide();
                        var _this = $(this);
                        if(!_thisMv){
                            _this.addClass('focus');
                        }
                        _this.closest('div').addClass(_cl);
                    },
                    blur : function(){
                        var _this = $(this);
                        if(!_thisMv) _this.removeClass('focus');
                        _this.closest('div').removeClass(_cl);
                    },
                    keyup : function(e){
                        var _this = $(this);
                        if(e.keyCode == 27) _this.closest('div').addClass(_cl); 
                    },
                    mouseenter : function(){
                        _thisMv = true;
                    },
                    mouseleave : function(){
                        _thisMv = false;
                    }
                }).children().off('click').on('click', function(){
                    $(this).blur();
                });//_for_this
            };//for            
        },//select(idx)
        chkbox : function(idx){
            /* 
                idx = 체크박스 있는곳
            */
            var that = this,
                _inpChk = idx.find('input[type="checkbox"]'),
                _chkds = function(type){/* type = undefined(초기세팅) */
                    var _inpChk_lg = _inpChk.length;
                    for(var i = 0; _inpChk_lg > i; i++){
                        var _this = $(_inpChk[i]),
                            _label = $('label[for="'+_this.id+'"]');
                        
                        if(typeof type == 'undefined' && _this.checked) _label.addClass('checked');
                    }//for()
                },//_chkds(tyep)
                _allChk =  function(idx, tyeps){//전체
                    var _this = idx,
                        _inp = _this.parents('.chk_box').find('input[type="checkbox"]');
                    
                    $.each(_inp, function(eachNum, eachThis){
                        var _eachThis = $(eachThis),
                            _all = _eachThis[0].dataset.all;

                        if(typeof _all === 'undefined'){
                            if(!tyeps){
                                eachThis.checked = false;
                                _eachThis.prev('label').removeClass('checked');
                            }else{
                                eachThis.checked = true;
                                _eachThis.prev('label').addClass('checked');
                            }
                        }
                    });
                    
                },
                _on = function(_chkbox, _labels){
                    var _inp_chkbox = $(_chkbox),
                        for_ck = false,
                        for_not = function(){//for 버그체크			
                            setTimeout(function(){
                                if(!for_ck) _inp_chkbox.trigger('click');
                            }, 100);
                        };
                        
                    _inp_chkbox.attr('data-chkbox', true).on('change', function(){
                        for_ck = true;
                    });
                    
                    _labels.attr({
                        tabindex : '0'
                    }).on({
                        click : function(e){
                            for_ck = false;//초기화
                            if(for_ck) return false;
                            
                            var _this = $(this),
                                _chkbx = idx.find('#'+_this.attr('for')),
                                _chkd = _chkbx.is(':checked'),
                                _all = _chkbx.attr('data-all'),
                                _allType = _chkd ? false : true;
                            
                            if(_chkbx.is(':disabled')) return false;
                            
                            if(_chkd) _this.removeClass('checked');
                            else _this.addClass('checked');
                            
                            if(_all) _allChk(_this, _allType);
                           
                            var _sel_st3_box = _this.parents('.sel_st3_box'),
                        		_chk_box = _this.parents('.chk_box');
                            
                            	if(_sel_st3_box.length == 0) that.openHide();
                            		
                            	//주위에 all체크 있으면 풀어줘요
                                setTimeout(function() {
                                    if(_chk_box.length > 0){
                                        var _sibling_allInput = _chk_box.find('[data-all]');

                                        if(_sibling_allInput.length > 0){
                                            var _inp_checked = _chk_box.find('input[type="checkbox"]:checked');
                                            
                                            //체크된거 글씨 바꺼주기
                                            if(_sel_st3_box.length > 0){
                                                var _inp_text = '',
	                                                _checked_text = [],
	                                                _checked_val = [],
                                                	_sel_st3 = _sel_st3_box.find('.sel_st3');
                                                
                                                if(_inp_checked.length > 0){
                                                	$.each(_inp_checked, function(each_num, each_this){
                                                        if(!$(each_this).attr('data-all')){
                                                        	_checked_text.push($(each_this).prev().text());
                                                        	//_checked_val.push($(each_this).val());
                                                        	_checked_val.push($(each_this).prev().text());
                                                        }
                                                    });
                                                	_inp_text = _checked_text.join();
                                                }else _inp_text = _sel_st3.attr('title');
                                                
                                                _sel_st3.find('span').html(_inp_text);
                                                _sel_st3.siblings('input').val(_checked_val.join())
                                            }
                                            
                                            if(typeof _all === 'undefined'){
                                                if(_sibling_allInput.is(':checked')){
                                                    _sibling_allInput[0].checked = false;
                                                    _sibling_allInput.prev('label').removeClass('checked');
                                                }else if(_chk_box.find('input[type="checkbox"]').length-1 === _inp_checked.length){
                                                    _sibling_allInput[0].checked = true;
                                                    _sibling_allInput.prev('label').addClass('checked');
                                                    if(_sel_st3_box.length > 0) _sel_st3_box.find('.sel_st3 span').html('전체');                                                 
                                                }
                                            }else{
                                                if(_sel_st3_box.length > 0 && (_chk_box.find('input[type="checkbox"]').length === _inp_checked.length)) _sel_st3_box.find('.sel_st3 span').html('전체');
                                            }
                                            
                                        }
                                    }    
                                }, 1);
                                             
                            for_not();//for 버그 체크
                        },//click
                        keydown : function(e){
                            if(e.keyCode == 13) $(this).trigger('click');
                        }//keydown
                    });
                };//_on(_labels)
            
            _chkds();//초기 체크된거 확인
            for(var i = 0, lg = _inpChk.length; lg > i; i++ ){
                var _chkbox = _inpChk[i],
                    _data_chkbox = $(_chkbox).attr('data-chkbox'),
                    _data_init = $(_chkbox).attr('data-init'),
                    _labels = idx.find('label[for="'+_chkbox.id+'"]');
            
                //init에서 실행되는거
                if(typeof _data_chkbox === 'undefined' && typeof _data_init === 'undefined') _on(_chkbox, _labels);	
                
                //init에서 실행안되게 
                if(_data_init == 'false') _on(_chkbox, _labels);
                
            }
        },//chkbox(idx)
        radio : function(idx){
            /* 
                idx = 체크박스 있는곳
            */
            var that = this,
                _radiobox = idx.parent().find('input[type="radio"]'),
				_cl = 'checked';//class

			_radiobox.each(function(eachNum, eachThis){
				var _eachThis = $(eachThis),
					_evChk = _eachThis.attr('data-ev-chk');//이벤트 걸린거 체크
					
				if(typeof _evChk === 'undefined'){
					var _label = _eachThis.prev();					

					//라디오박스
					_eachThis.prop('data-ev-chk', true);

					//라디오박스에 체크 되어있으면 label에 _cl
					if(_eachThis.is(':checked')) _label.addClass(_cl);

					//label 이벤트
					_label.prop({tabindex : '0'}).on({
                        click : function(e){
                            var _this = $(this),
                                _inp = _this.next(),
								_name = _inp.attr('name'),
								_disabled = _inp.is(':disabled');
                            
                            that.openHide();

							//disabled 클릭X
                            if(_disabled) return false;
                            
							//_cl 적용
                            _this.addClass(_cl);
                            
							//클릭한거 빼고 remove
							setTimeout(function(){
								$('input[name="'+_name+'"]').not(':checked').each(function(eachNum2, eachThis2){
									$(eachThis2).prev().removeClass(_cl);
								});
							}, 1);							
                        },//click
                        keydown : function(e){
                            if(e.keyCode == 13) $(this).trigger('click');
                        }//keydown
                    });//_label.on({
				}
			});//_radiobox.each
        },//radio(idx)
        openHide : function(){
			$('.open').removeClass('open');
		},//
        setDatePicker : function(calendarId,callBack,option){
            var $inpSearchDate = $(calendarId);
            var datepickerOption = {
                closeText:'닫기',
                currentText:'오늘',
                dateFormat:"yy-mm-dd",
                //onClose:onCloseHandler,
                //onSelect:onCloseHandler,
                prevText:"이전 달",
                nextText:"다음 달",
                monthNames: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
                monthNamesShort: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
                dayNames:['일요일','월요일','화요일','수요일','목요일','금요일','토요일'],
                dayNamesShort:['일','월','화','수','목','금','토'],
                dayNamesMin:['일','월','화','수','목','금','토'],
                changeYear: true
            };
            
            // merge options
            if(typeof option !== 'undefined' && option !== {}){
                for(var key in option){
                    datepickerOption[key] = option[key];
                }
            }
            
            //달력 년/월/일 설정
            $inpSearchDate.datepicker(datepickerOption);
            
            $inpSearchDate.focus(function(event){
                var object = this;
                if (object.setSelectionRange) {
                    object.focus();
                    object.setSelectionRange(0, object.value.length);
                } else if (object.createTextRange) {
                    var range = object.createTextRange();
                    range.collapse(object);
                    range.moveEnd('character', object.value.length);
                    range.moveStart('character', 0);
                    range.select();
                }
            });
        }//DatePicker
	}//sixUi.prototype = {

	window.sixUi = new sixUi();
})(window, jQuery);