define(function (require) {
    var hoss = require('hoss'),
        apiHost = hoss.apiHost;

    var $ = require('jquery'),
        template = require("template"),
        navigation = require('navigation'),
        sysMessage=require("system-message");
    var xhr = require('xhr'),
        jsonp = xhr.jsonp,
        clearEmptyValue = xhr.clearEmptyValue,
        doneCallback = xhr.done,
        failCallback = xhr.fail;
    var queryString = require("script/get-query-string");

    var systemMessage = require('system-message');
    var areaPicker = require('area-picker');
    var dateExtend = require('date-extend');
    var datepicker = require('datepicker');
    var pagination = require('pagination');

    var util = require('script/approval/brokerage-apply-util');

    var progressUpload = require('script/progress-upload');


    var accounting = require('accounting'),
        formatNumber = accounting.formatNumber
    template.helper("formatNumber",accounting.formatNumber); // 对 template 增加全局变量或方法

    var $cityList = $('#cityList');


    function bindEvent(){

        util.initDatePicker(); // 日期
        util.initCityList();

        var $selectedClient = $('#selectedClient'),
            $flowList = $('#flowList');

        $cityList.change(util.clearClient); // 选择城市 清空已经选中的成交客户

        $('#selectClient').click(util.checkClient); // 打开查询

        $selectedClient.delegate('[adjust]', 'keyup', util.adjustKeyUp); // 修改应付事件
        $selectedClient.delegate('a[delete]', 'click', util.deleteClick); // 删除事件

        $('#mainCbx').click(util.selectAll); // 全选事件
        $flowList.delegate('[flowId]', 'click', util.checkFlow); // 单选事件

        $('#selectBtn').click(util.selectBtnClick); // 选完 确认按钮 事件

        // 查看详情
        $selectedClient.delegate('a[info]', 'click', util.infoClick);
        $flowList.delegate('a[info]', 'click', util.infoClick);

        // 佣金结算标准
        $selectedClient.delegate('a[projectId]', 'click', modalClick);
        $flowList.delegate('a[projectId]', 'click', modalClick);
        function modalClick(e){
            util.brokerageModalClick(e, 'org');
        }

        // 绑定上传图片
        progressUpload.bindAddFileLink($('#addFileLink'), $('#fileProgressBox'), 5);

        // 绑定查询成交客户
        util.bindSearchForm();

        // 绑定提交  机构类型
        util.bindAddForm('organization');

        // 数字处理 (跳点佣金)
        $('#selectedClient').on('blur', 'input[name=crossAmount]', function() {
            var $item = $(this),
                $adjustGroup = $item.parents('tr').prev().find('[adjustGroup]');

            if( !$.isNumeric($item.val()) ) {
                $item.val(0);
                util.updateAdjustSum($item);
            } else if( parseInt($item.val()) < 0 ) {
                $item.val(0);
                util.updateAdjustSum($item);
            }
        });


    }




    var workflowProp = require('script/approval/workflow-properties');
    function initWorkFlow(){
        var workflowObj = workflowProp.workflowObj;
        workflowObj.wfInstanceId = '';
        workflowObj.businessKey = '';
        workflowObj.taskId = '';
        workflowObj.processKey = workflowProp.definitionConstants.YJTD;
        workflowObj.flowImageId = "flow";
        workflowObj.contentId = "content";
        workflowObj.workflowCommentId = "workflowComment";
        workflowObj.flowType = 'new';
        workflowObj.projectId = "projectId";
        workflowObj.cityId = "cityList";
        workflowProp.showWorkFlowAll(workflowObj);
    }


    $(document).ready(function(){

        bindEvent();
        initWorkFlow();

    });

});