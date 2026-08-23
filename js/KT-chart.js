(function () {

    // ============================================================
    // 1. 找到 Hexo ECharts tag 创建的图表容器
    // ============================================================

    var chartDom = document.getElementById('KT-chart');

    if (!chartDom) {
        console.error('KT-chart: chart container not found.');
        return;
    }


    // ============================================================
    // 2. 初始化 ECharts
    // ============================================================

    var chart = echarts.init(chartDom);


    // ============================================================
    // 3. 从外部 JSON 文件读取 KT 参数
    // ============================================================

    fetch('/data/KT_parameters.json')

        .then(function (response) {

            if (!response.ok) {
                throw new Error(
                    'Failed to load KT_parameters.json: ' +
                    response.status
                );
            }

            return response.json();

        })


        .then(function (data) {


            console.log(
                'KT parameters loaded:',
                data.length,
                'solvents'
            );


            // ====================================================
            // 4. ECharts 配置
            // ====================================================

            var option = {


                // ------------------------------------------------
                // 标题
                // ------------------------------------------------

                title: {

                    text: 'Kamlet–Taft Solvent Parameter Space',

                    left: 'center',

                    top: 10,

                    textStyle: {

                        fontSize: 20,

                        fontWeight: 'bold'

                    }

                },


                // ------------------------------------------------
                // Tooltip
                // ------------------------------------------------

                tooltip: {

                    formatter: function (params) {

                        var d = params.data;

                        return [

                            '<strong>' + d.solvent + '</strong>',

                            'π*: ' + d.pi,

                            'α: ' + d.alpha,

                            'β: ' + d.beta

                        ].join('<br>');

                    }

                },


                // ------------------------------------------------
                // 3D 坐标系
                // ------------------------------------------------

                grid3D: {

                    boxWidth: 160,

                    boxDepth: 160,

                    boxHeight: 160,


                    viewControl: {

                        projection: 'perspective',

                        autoRotate: true,

                        autoRotateSpeed: 5,

                        distance: 250

                    },


                    light: {

                        main: {

                            intensity: 1.2,

                            shadow: true

                        },

                        ambient: {

                            intensity: 0.4

                        }

                    }

                },


                // ------------------------------------------------
                // X axis = α
                // ------------------------------------------------

                xAxis3D: {

                    type: 'value',

                    name: 'α',

                    nameTextStyle: {

                        fontSize: 16

                    },

                    axisLabel: {

                        fontSize: 12

                    }

                },


                // ------------------------------------------------
                // Y axis = β
                // ------------------------------------------------

                yAxis3D: {

                    type: 'value',

                    name: 'β',

                    nameTextStyle: {

                        fontSize: 16

                    },

                    axisLabel: {

                        fontSize: 12

                    }

                },


                // ------------------------------------------------
                // Z axis = π*
                // ------------------------------------------------

                zAxis3D: {

                    type: 'value',

                    name: 'π*',

                    nameTextStyle: {

                        fontSize: 16

                    },

                    axisLabel: {

                        fontSize: 12

                    }

                },


                // =================================================
                // 5. Dataset
                // =================================================

                dataset: {

                    dimensions: [

                        'solvent',

                        'pi',

                        'alpha',

                        'beta'

                    ],

                    source: data

                },


                // =================================================
                // 6. Scatter 3D
                // =================================================

                series: [

                    {

                        name: 'Solvents',

                        type: 'scatter3D',

                        symbol: 'circle',

                        symbolSize: 10,


                        itemStyle: {

                            opacity: 0.85

                        },


                        emphasis: {

                            itemStyle: {

                                opacity: 1,

                                borderWidth: 2

                            },

                            label: {

                                show: true,

                                formatter: function (params) {

                                    return params.data.solvent;

                                }

                            }

                        },


                        encode: {

                            // X = α
                            x: 'alpha',

                            // Y = β
                            y: 'beta',

                            // Z = π*
                            z: 'pi',

                            tooltip: [

                                'solvent',

                                'pi',

                                'alpha',

                                'beta'

                            ]

                        }

                    }

                ]

            };


            // ====================================================
            // 7. 绘制图表
            // ====================================================

            chart.setOption(option);


        })


        .catch(function (error) {

            console.error(
                'KT ECharts error:',
                error
            );

        });


    // ============================================================
    // 8. 响应式
    // ============================================================

    window.addEventListener('resize', function () {

        chart.resize();

    });


})();