var count = 1;

var app = new Vue({
    el: '#app',
    vuetify: new Vuetify(),
    data () {
        return {
            headers: [
                { text: '序号', align: 'center', sortable: false, value: 'no' },
                { text: '昵称', align: 'center', sortable: false, value: 'name' },
                { text: '等级', value: 'level' },
                { text: '总分数', value: 'score' },
                { text: '平均每天分数', value: 'avgScore', sortable: false },
                { text: '分数占比', value: 'percent' },
            ],
            isLoading: false,
            loadingText: '加载中, 请稍等片刻...',
            date: '',
            type: '',
            search: '',
            clanName: '',
            list: [],
            members: [],
        }
    },
    mounted: function () {
        this.myGet('./data/config.json', res => {
            this.list = res.data.list
            this.clanName = res.data.clanName
            document.title = `${this.clanName} ${this.date} 会战记录`
        })
    },
    watch: {
        list: function (val, oldVal) {
            this.date = val[0]
        },
        date: function (val, oldVal) {
            this.useData(val)
        },
        type: function (val, oldVal) {
            let url = `./linechart.html`
            let query = `?date=${this.date}&name=${this.clanName}`
            
            if (val == '饼图')  url = `./piechart.html`
            if (val == '条形图')url = `./bargraph.html`
            
            window.open(url + query, '_blank')
        },
    },
    methods: {
        count: function () {
            let result = count;
            count++;
            if (count > this.members.length) {
                count = 1;
            }
            return result;
        },
        useData: function (date) {
            this.myGet(`./data/${date}.json`, res => {
                let sumScore = 0

                res.data.members.forEach(({ score }) => {
                    sumScore += score
                })

                app.members = res.data.members.map( ({ name, level, score }) => ({
                    name,
                    level,
                    score,
                    avgScore: parseInt(score / res.data.days),
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