/**
 * 中介客户管理
 */
define(function (require) {

    var hoss = require('hoss'),
        apiHost = hoss.apiHost;

    require(['jquery', 'datepicker', 'dist/script/bootstrap.min', 'dist/script/bootstrap-select']);
    var navigation = require('navigation');
    var xhr = require('xhr'),
        jsonp = xhr.jsonp,
        clearEmptyValue = xhr.clearEmptyValue,
        doneCallback = xhr.done,
        failCallback = xhr.fail;
    var template = require('template');
    var pagination = require('pagination');
    var confirmation = require('bootstrap/confirmation');
    var systemMessage = require('system-message');
    var dateStr = require('date-extend');
    var queryString = require('get-query-string'), // 读取 URL 附加参数
        appendParams = {},
        appendParamsStr;
    $.each({
        TYPE:queryString('TYPE'),
        ORG_ID:queryString('ORG_ID'),
        EMPLOY_ID:queryString('EMPLOY_ID'),
        CORPORATION_STATUS:queryString('CORPORATION_STATUS'),
        EMPLOY_NAME:queryString('EMPLOY_NAME'),
        projectId:queryString('projectId'),
        PROJECT_STATUS:queryString('PROJECT_STATUS'),
        shopId:queryString('shopId')
    }, function(key, value){ // 清理空参
        if (value) {
            appendParams[key] = value;
        }
    });
    appendParamsStr = $.param(appendParams) + '&';

    //var startTime = queryString('startTime'),
       // endTime = queryString('endTime');


    function domReady() {

        $('.selectpicker').selectpicker({
            'noneSelectedText': '单据状态'
        });


       // if (startTime){ // 本周数据、 本月数据 跳转附带 日期参数

         //   $('input[name=startTime]').val(startTime);
          //  $('input[name=endTime]').val(endTime);
       // }

        var $datepickerGroup = $('#datepicker > input'),
            startDate;
        $datepickerGroup.datepicker({
            autoclose: true,
            language: 'zh-CN',
            dateFormat: 'yy-mm-dd'
        });
        var $searchForm = $('#searchForm'),
            $pageNum = $searchForm.find('input[name=page]'),
            $pageSize = $searchForm.find('input[name=size]'),
            $searchResultList = $('#searchResultList'),
            $searchResultPagination = $('#searchResultPagination'),
            searchResultTemplate = 'searchResultTemplate',
            messageTemplate = 'messageTemplate',
            queryClientRecordListCode = '/hoss/league/contract/listContract.do';

        // 获取直客专员管理列表
        $searchForm.on('submit', function (event) {
            var $context = $(this),
                $disabled = $context.find('[disabled]'),
                $submit = $context.find('input[type=submit]');

            if (event) {
                event.preventDefault();
            }

            if ($submit.hasClass('disabled')) {
                return false;
            }

            $disabled.removeAttr('disabled');


            // 设置多选的值
            var selectVal= $('#id_select').val();
            $('input[name=basicStatus]').val(selectVal&&selectVal.join(','));




            $.ajax($.extend({
                url: apiHost + queryClientRecordListCode,
                data:appendParamsStr + clearEmptyValue($context),
                beforeSend: function () {
                    $submit.attr('disabled', 'disabled');
                }
            }, jsonp)).
                done(function (data) {

                    function useful(data) {

                        var dataObj = data.data || {},
                            templateId = ($.isArray(dataObj.content) && dataObj.content.length) ?
                                searchResultTemplate :
                                messageTemplate;

                        // 显示数据
                        $searchResultList.find('tbody').html(
                            template(templateId, data)
                        ).find('[status]');

                        // 显示分页
                        $searchResultPagination.pagination({
                            $form: $context,
                            totalSize: dataObj.totalElements,
                            pageSize: parseInt($pageSize.val()),
                            visiblePages: 5,
                            info: true,
                            paginationInfoClass: 'pagination-count pull-left',
                            paginationClass: 'pagination pull-right',
                            onPageClick: function (event, index) {
                                $pageNum.val(index - 1);
                                $context.trigger('submit');
                            }
                        });


                    }

                    function useless(data) {
                        systemMessage({
                            type: 'info',
                            title: '提示：',
                            detail: data.detail || '获取列表数据失败！'
                        });
                    }

                    doneCallback.call(this, data, useful, useless);
                }).
                fail(function (jqXHR) {
                    failCallback.call(this, jqXHR, '获取列表数据失败！');
                }).
                always(function () {
                    $disabled.attr('disabled', 'disabled');
                    $submit.removeAttr('disabled').blur();
                });

        }).trigger('submit');



    }

    $(document).ready(domReady);




});