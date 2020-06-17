var count = 1;

var app = new Vue({
    el: '#app',
    vuetify: new Vuetify(),
    data () {
        return {
            headers: [
                { text: '序号', sortable: false, value: 'no', align: 'center' },
                { text: '昵称', sortable: false, value: 'name', align: 'center' },
                { text: '等级', value: 'level' },
                { text: '总分数', value: 'score' },
                { text: '平均每天分数', value: 'avgScore', sortable: false },
                { text: '分数占比', value: 'percent' },
            ],
            isLoading: false,
            loadingText: '加载中, 请稍等片刻...',
            date: '',
            search: '',
            clanName: '',
            footerMsg: null,
            members: [],
            dateList: [],
            dspTypeList: [
                { name: '饼图', value: 0 },
                { name: '条形图', value: 1 },
                { name: '排名趋势', value: 2 },
            ],
        }
    },
    mounted: function () {
        this.myGet('./config.json', ({ data }) => {
            this.dateList = data.dateList
            this.clanName = data.clanName
            this.footerMsg = data.footerMsg
            document.title = `${this.clanName} ${this.date} 会战记录`
        })
    },
    watch: {
        dateList: function (val, oldVal) {
            this.date = val[0]
        },
        date: function (val, oldVal) {
            this.useData(val)
        },
    },
    methods: {
        counter: function () {
            let result = count;
            count++;
            if (count > this.members.length) {
                count = 1;
            }
            return result;
        },
        open: function (arg) {
            let url = './charts/'
            let query = `?date=${this.date}&name=${this.clanName}`

            switch (arg) {
                case 0: url += `piechart.html`; break;
                case 1: url += `bargraph.html`; break;
                case 2: url += `linechart.html`; break;
                default: alert(`Error: arg is unavailable, arg is ${arg}.`); return;
            }

            window.open(url + query, '_blank');
        },
        useData: function (date) {
            this.myGet(`./data/${date}.json`, ({ data }) => {
                let sumScore = 0

                data.members.forEach(m => sumScore += m.score)

                app.members = data.members.map( ({ name, level, score }) => ({
                    name,
                    level,
                    score,
                    avgScore: parseInt(score / data.days),
                    percent: (score / sumScore * 100).toFixed(2) + '%'
                }))
            })
        },
        myGet: function (url, callbackfn) {
            this.isLoading = true

            axios.get(url)
                 .then(res => {
                    callbackfn(res);
                    this.isLoading = false
                 })
                 .catch(function (e) { 
                    this.isLoading = true
                    this.loadingText = '获取数据失败或程序出现异常。\n错误信息：' + e
                 })
        }
    }
})