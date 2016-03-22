$(document).ready(function() {
  var nowTemp = new Date();
  var now = new Date(nowTemp.getFullYear(), nowTemp.getMonth(), nowTemp.getDate(), 0, 0, 0, 0);
var checkin = $('.dpd1').fdatepicker({
					  onRender: function (date) {
						//return date.valueOf() < now.valueOf() ? 'disabled' : '';
            return date;
					}
				}).on('changeDate', function (ev) {
					if (ev.date.valueOf() > checkout.date.valueOf()) {
						var newDate = new Date(ev.date)
						newDate.setDate(newDate.getDate() + 1);
						checkout.update(newDate);
					}
					checkin.hide();
					$('.dpd2')[0].focus();
				}).data('datepicker');
				var checkout = $('.dpd2').fdatepicker({
					onRender: function (date) {
						return date.valueOf() <= checkin.date.valueOf() ? 'disabled' : '';
					}
				}).on('changeDate', function (ev) {
					checkout.hide();
				}).data('datepicker');


        $('.dpd1').fdatepicker({
          format: 'dd.mm.yyyy',
          weekStart: '1',
          pickTime: false,
        });
        $('.dpd2').fdatepicker({
          format: 'dd.mm.yyyy',
          weekStart: '1',
          pickTime: false,
        });

        $('.dpt1').fdatepicker({
          format: 'hh:ii',
          disableDblClickSelection: true,
          language: 'vi',
          pickTime: true,
          minView: '0',
          maxView: '1'
        });

      $('.dpt2').fdatepicker({
      format: 'hh:ii',
      disableDblClickSelection: true,
      language: 'vi',
      minView: '0',
      maxView: '2'
      });

});
