import { Looker, VisualizationDefinition } from './types';

declare var looker: Looker;
declare var d3: any;
declare var LookerCharts: any;

const vis: VisualizationDefinition = {
  id: "revenue_to_end_flow",
  label: "Revenue to End Flow",
  options: {
    account_performance_dashboard_url: {
      type: "string",
      label: "Account Performance Dashboard URL",
      default: "",
      section: "Dashboard Links"
    },
    sales_performance_dashboard_url: {
      type: "string",
      label: "Sales Performance Dashboard URL",
      default: "",
      section: "Dashboard Links"
    },
    marketing_performance_dashboard_url: {
      type: "string",
      label: "Marketing Performance Dashboard URL",
      default: "",
      section: "Dashboard Links"
    },
    pipeline_dashboard_url: {
      type: "string",
      label: "Pipeline Dashboard URL",
      default: "",
      section: "Dashboard Links"
    },
    backlog_dashboard_url: {    
      type: "string",
      label: "Backlog Dashboard URL",
      default: "",
      section: "Dashboard Links"
    },
    revenue_dashboard_url: {
      type: "string",
      label: "Revenue Dashboard URL",
      default: "",
      section: "Dashboard Links"
    },
    gross_profit_dashboard_url: {
      type: "string",
      label: "Gross Profit Dashboard URL",
      default: "",
      section: "Dashboard Links"
    },
    operating_expenses_dashboard_url: {
      type: "string",
      label: "Operating Expenses Dashboard URL",
      default: "",
      section: "Dashboard Links"
    },
    support_cost_dashboard_url: {
        type: "string",
        label: "Support Cost Dashboard URL",
        default: "",
        section: "Dashboard Links"
    },
    non_billable_cost_dashboard_url: {
        type: "string",
        label: "Non-Billable Cost Dashboard URL",
        default: "",
        section: "Dashboard Links"
    },
    ebitda_dashboard_url: {
        type: "string",
        label: "EBITDA Dashboard URL",
        default: "",
        section: "Dashboard Links"
      },
    account_profitability_dashboard_url: {
        type: "string",
        label: "Account Profitability Dashboard URL",
        default: "",
        section: "Dashboard Links"
      },
    project_profitability_dashboard_url: {
        type: "string",
        label: "Project Profitability Dashboard URL",
        default: "",
        section: "Dashboard Links"
      },
    cost_of_sales_dashboard_url: {
      type: "string",
      label: "Cost of Sales Dashboard URL",
      default: "",
      section: "Dashboard Links"
    },
    alliance_cost_dashboard_url: {
      type: "string",
      label: "Alliance Cost Dashboard URL",
      default: "",
      section: "Dashboard Links"
    },
    direct_sales_cost_dashboard_url: {
      type: "string",
      label: "Direct Sales Cost Dashboard URL",
      default: "",
      section: "Dashboard Links"
    },
    marketing_cost_dashboard_url: {
      type: "string",
      label: "Marketing Cost Dashboard URL",
      default: "",
      section: "Dashboard Links"
    },
    delivery_cost_dashboard_url: {
      type: "string",
      label: "Delivery Cost Dashboard URL",
      default: "",
      section: "Dashboard Links"
    },
    bench_cost_dashboard_url: {
      type: "string",
      label: "Bench Cost Dashboard URL",
      default: "",
      section: "Dashboard Links"
    }
  },
  
  readyPromise: null,

  create: function(element, config) {
    element.style.backgroundColor = 'transparent';
    this.readyPromise = new Promise((resolve) => {
      const setup = () => {
        this.container = d3.select(element)
          .append("div")
          .attr("class", "revenue-sankey-container")
          .style("width", "100%")
          .style("height", "100%")
          .style("font-family", "Arial, sans-serif")
        resolve(null);
      };

      if (typeof d3 === "undefined" || !d3.sankey) {
        this.loadD3().then(setup);
      } else {
        setup();
      }
    });
  },
  
  updateAsync: function(data, element, config, queryResponse, details, done) {
    this.readyPromise.then(() => {
      this.render(config, data, queryResponse);
      done();
    });
  },
  
  loadD3: function() {
    return new Promise((resolve) => {
      // Load D3.js
      var d3Script = document.createElement("script");
      d3Script.src = "https://d3js.org/d3.v7.min.js";
      d3Script.onload = function() {
        // Load d3-sankey
        var sankeyScript = document.createElement("script");
        sankeyScript.src = "https://unpkg.com/d3-sankey@0.12.3/dist/d3-sankey.min.js";
        sankeyScript.onload = function() {
          resolve(null);
        };
        document.head.appendChild(sankeyScript);
      };
      document.head.appendChild(d3Script);
    });
  },
  
  render: function(config: any, data: any[], queryResponse: any) {
    
    // Clear previous content
    this.container.selectAll("*").remove();

    if (!data || data.length === 0) {
      this.container.append("div")
        .style("text-align", "center")
        .style("padding-top", "40px")
        .html("Run a query to see the Revenue Flow visualization.");
      return;
    }
    
    // Configuration
    var vizConfig = {
      width: 1400,
      height: 700,
      margin: {top: 10, right: 10, bottom: 10, left: 50},
      nodeWidth: 30,
      nodePadding: 65,
      linkOpacity: 0.5,
      linkHoverOpacity: 0.7
    };
    
    // Dashboard URL mapping
    var dashboardUrls = {
      "Account Performance": config.account_performance_dashboard_url,
      "Sales Performance": config.sales_performance_dashboard_url,
      "Marketing Performance": config.marketing_performance_dashboard_url,
      "Pipeline": config.pipeline_dashboard_url,
      "Backlog": config.backlog_dashboard_url,
      "REVENUE": config.revenue_dashboard_url,
      "Gross Profit": config.gross_profit_dashboard_url,
      "EXPENSES": config.operating_expenses_dashboard_url,
      "Support Cost": config.support_cost_dashboard_url,
      "Non-Billable Cost": config.non_billable_cost_dashboard_url,
      "EBITDA": config.ebitda_dashboard_url,
      "Account Profitability": config.account_profitability_dashboard_url,
      "Project Profitability": config.project_profitability_dashboard_url,
      "COST OF SALES": config.cost_of_sales_dashboard_url,
      "Alliance Cost": config.alliance_cost_dashboard_url,
      "Direct Sales Cost": config.direct_sales_cost_dashboard_url,
      "Marketing Cost": config.marketing_cost_dashboard_url,
      "Delivery Cost": config.delivery_cost_dashboard_url,
      "Bench Cost": config.bench_cost_dashboard_url
    };
    
    // Data for Revenue to End flow
    var staticData = {
      nodes: [
        {name: "Account Performance", id: "account_performance"}, // 0
        {name: "Sales Performance", id: "sales_performance"}, // 1
        {name: "Marketing Performance", id: "marketing_performance"}, // 2
        {name: "Pipeline", id: "pipeline"}, // 3
        {name: "Backlog", id: "backlog"}, // 4
        {name: "", id: "rest_of_pipeline"}, // 5
        {name: "Revenue", id: "revenue"}, // 6
        {name: "Gross Profit", id: "gross_profit"}, // 7
        {name: "Expenses", id: "operating_expenses"}, // 8
        {name: "Support Cost", id: "support_cost"}, // 9
        {name: "Non-Billable Cost", id: "non_billable_cost"}, // 10
        {name: "EBITDA", id: "ebitda"}, // 11
        {name: "Account Profitability", id: "account_profitability"}, // 12
        {name: "Project Profitability", id: "project_profitability"}, // 13
        {name: "Cost of Sales", id: "cost_of_sales"}, // 14
        {name: "Alliance Cost", id: "alliance_cost"}, // 15
        {name: "Direct Sales Cost", id: "direct_sales_cost"}, // 16
        {name: "Marketing Cost", id: "marketing_cost"}, // 17
        {name: "Delivery Cost", id: "delivery_cost"}, // 18
        {name: "Bench Cost", id: "bench_cost"}, // 19
        {name: "EarlyEnd", id: "early_end"}, // 20
        {name: "", id: "dummy_node1"}, // 21
        {name: "", id: "dummy_node2"} // 22
      ],
      links: [
        {source: 0, target: 3, value: 70},  // Account Performance -> Pipeline
        {source: 1, target: 3, value: 70},  // Sales Performance -> Pipeline
        {source: 2, target: 3, value: 70},  // Marketing Performance -> Pipeline

        {source: 3, target: 4, value: 210}, // Pipeline -> Backlog
        // {source: 3, target: 5, value: 30}, // Pipeline -> Rest of Pipeline

        // {source: 5, target: 20, value: 30}, // Rest of Pipeline -> EarlyEnd
        
        {source: 4, target: 6, value: 210},  // Backlog -> Revenue

        {source: 6, target: 7, value: 120},     // Revenue -> Gross Profit
        {source: 6, target: 14, value: 90},     // Revenue -> Cost of Sales

        {source: 7, target: 8, value: 90},     // Gross Profit -> Expenses
        {source: 7, target: 21, value: 0},     // Gross Profit -> DN1
        {source: 7, target: 11, value: 30},    // Gross Profit -> EBITDA
        {source: 21, target: 22, value: 0},    // DN1 -> DN2
        {source: 22, target: 11, value: 0},    // DN2 -> EBITDA


        {source: 8, target: 9, value: 45},      // Expense -> Support Cost
        {source: 8, target: 10, value: 45},     // Expense -> Non-Billable Cost
        
        {source: 9, target: 20, value: 20},     // Support Cost -> EarlyEnd
        {source: 10, target: 20, value: 20},    // Non-Billable Cost -> EarlyEnd

        {source: 11, target: 12, value: 15},    // EBITDA -> Account Profitability
        {source: 11, target: 13, value: 15},    // EBITDA -> Project Profitability
        

        {source: 14, target: 21, value: 1},    // COST OF SALES -> DN1
        {source: 21, target: 15, value: 1},    // DN1 -> Alliance Cost
        {source: 14, target: 15, value: 18},   // COST OF SALES -> Alliance Cost
        {source: 21, target: 16, value: 1},    // DN1 -> Direct Sales Cost
        {source: 14, target: 16, value: 18},   // COST OF SALES -> Direct Sales Cost
        {source: 21, target: 17, value: 1},    // DN1 -> Marketing Cost
        {source: 14, target: 17, value: 18},   // COST OF SALES -> Marketing Cost
        {source: 21, target: 18, value: 1},    // DN1 -> Delivery Cost
        {source: 14, target: 18, value: 18},   // COST OF SALES -> Delivery Cost
        {source: 21, target: 19, value: 1},    // DN1 -> Bench Cost
        {source: 14, target: 19, value: 18},   // COST OF SALES -> Bench Cost

        {source: 15, target: 20, value: 18},   // Alliance Cost -> EarlyEnd
        {source: 16, target: 20, value: 18},   // Direct Sales Cost -> EarlyEnd
        {source: 17, target: 20, value: 18},   // Marketing Cost -> EarlyEnd
        {source: 18, target: 20, value: 18},   // Delivery Cost -> EarlyEnd
        {source: 19, target: 20, value: 18},   // Bench Cost -> EarlyEnd

        
      ]
    };
    
    var svg = this.container
      .append("svg")
      .attr("width", vizConfig.width)
      .attr("height", vizConfig.height);
    
    var sankey = d3.sankey()
      .nodeWidth(vizConfig.nodeWidth)
      .nodePadding(vizConfig.nodePadding)
      .nodeSort(null)
      .extent([[vizConfig.margin.left, vizConfig.margin.top], 
              [vizConfig.width - vizConfig.margin.right, vizConfig.height - vizConfig.margin.bottom]]);
    
    // var color = d3.scaleOrdinal(d3.schemeCategory10);

    const nodeColorMap = {
        "Account Performance": "#ECBF42",
        "Sales Performance": "#ECBF42",
        "Marketing Performance": "#ECBF42",
        "Pipeline": "#ECBF42",
        "Backlog": "#ECBF42",
        "": "#ECBF42",
        "Revenue": "#ECBF42",
        "Gross Profit": "#A8E6DB",
        "Expenses": "#2A5CFF",
        "Support Cost": "#2A5CFF",
        "Non-Billable Cost": "#2A5CFF",
        "EBITDA": "#A8E6DB",
        "Account Profitability": "#A8E6DB",
        "Project Profitability": "#A8E6DB",
        "Cost of Sales": "#2A5CFF",
        "Alliance Cost": "#2A5CFF",
        "Direct Sales Cost": "#2A5CFF",
        "Marketing Cost": "#2A5CFF",
        "Delivery Cost": "#2A5CFF",
        "Bench Cost": "#2A5CFF",
        "EarlyEnd": "#ADD8E6",
        "DummyNode1": "#FF69B4",
        "DummyNode2": "#ADD8E6" 
        
      };
      
      const pathColorMap = {
        "Account Performance->Pipeline": "#ECBF42",
        "Sales Performance->Pipeline": "#ECBF42",
        "Marketing Performance->Pipeline": "#ECBF42",
        "Pipeline->Backlog": "#ECBF42",
        "Backlog->Revenue": "#ECBF42",
        "Revenue->Gross Profit": "#A8E6DB",
        "Revenue->Cost of Sales": "#2A5CFF",
        "Gross Profit->Expenses": "#2A5CFF",
        "Gross Profit->EBITDA": "#A8E6DB", 
        "Expenses->Support Cost": "#2A5CFF",
        "Expenses->Non-Billable Cost": "#2A5CFF",
        "EBITDA->Account Profitability": "#A8E6DB",
        "EBITDA->Project Profitability": "#A8E6DB",
        "Cost of Sales->Alliance Cost": "#2A5CFF",  
        "Cost of Sales->Direct Sales Cost": "#2A5CFF",
        "Cost of Sales->Marketing Cost": "#2A5CFF",
        "Cost of Sales->Delivery Cost": "#2A5CFF",
        "Cost of Sales->Bench Cost": "#2A5CFF"
        // Any path not in this map will get the default gray color
      };


    function wrap(text: any, width: number) {
      text.each(function() {
        var text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line: string[] = [],
            lineNumber = 0,
            lineHeight = 1.1, // ems
            x = text.attr("x"),
            y = text.attr("y"),
            dy = parseFloat(text.attr("dy")) || 0,
            tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
        
        while (word = words.pop()) {
          line.push(word);
          tspan.text(line.join(" "));
          if (tspan.node().getComputedTextLength() > width && line.length > 1) {
            line.pop();
            tspan.text(line.join(" "));
            line = [word];
            tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
          }
        }
      })
    }
    
    function handleNodeClick(event: any, d: any) {
      var dashboardUrl = dashboardUrls[d.name as keyof typeof dashboardUrls];
      
      if (dashboardUrl && dashboardUrl.trim() !== "") {
        LookerCharts.Utils.openDrillMenu({
          links: [{
            label: "Open Dashboard",
            url: dashboardUrl
          }],
          event: event
        });
      } else {
        alert("No dashboard URL configured for " + d.name + ". Please configure it in the visualization settings.");
      }
    }
    
    var sankeyData = sankey(staticData);
    var nodes = sankeyData.nodes;
    var links = sankeyData.links;
    
    svg.append("g")
      .selectAll("path")
      .data(links.filter((d: any) => {
        // --- Conditions to HIDE a link ---
        const isGrossProfitToDummyPath = d.source.id === "gross_profit" && d.target.id === "dummy_node1";
        const isDirectSalesCostToEarlyEndPath = d.source.id === "direct_sales_cost" && d.target.id === "early_end";
        const isMarketingCostToEarlyEndPath = d.source.id === "marketing_cost" && d.target.id === "early_end";
        const isDeliveryCostToEarlyEndPath = d.source.id === "delivery_cost" && d.target.id === "early_end";
        const isBenchCostToEarlyEndPath = d.source.id === "bench_cost" && d.target.id === "early_end";
        const isAllianceCostToEarlyEndPath = d.source.id === "alliance_cost" && d.target.id === "early_end";
        const isSupportCostToEarlyEndPath = d.source.id === "support_cost" && d.target.id === "early_end";
        const isNonBillableCostToEarlyEndPath = d.source.id === "non_billable_cost" && d.target.id === "early_end";
        const isCostOfSalesToDummyPath = d.source.id === "cost_of_sales" && d.target.id === "dummy_node1";
        const isDummyNode1ToAllianceCostPath = d.source.id === "dummy_node1" && d.target.id === "alliance_cost";
        const isDummyNode1ToDirectSalesCostPath = d.source.id === "dummy_node1" && d.target.id === "direct_sales_cost";
        const isDummyNode1ToMarketingCostPath = d.source.id === "dummy_node1" && d.target.id === "marketing_cost";
        const isDummyNode1ToDeliveryCostPath = d.source.id === "dummy_node1" && d.target.id === "delivery_cost";
        const isDummyNode1ToBenchCostPath = d.source.id === "dummy_node1" && d.target.id === "bench_cost";
        const isDummyNode1ToDummyNode2Path = d.source.id === "dummy_node1" && d.target.id === "dummy_node2";
        const isDummyNode2ToEBITDAPath = d.source.id === "dummy_node2" && d.target.id === "ebitda";
    
        
        return !isGrossProfitToDummyPath && !isDirectSalesCostToEarlyEndPath &&
        !isMarketingCostToEarlyEndPath && !isDeliveryCostToEarlyEndPath && 
        !isBenchCostToEarlyEndPath && !isAllianceCostToEarlyEndPath &&
        !isSupportCostToEarlyEndPath && !isNonBillableCostToEarlyEndPath &&
        !isCostOfSalesToDummyPath && !isDummyNode1ToAllianceCostPath &&
        !isDummyNode1ToDirectSalesCostPath && !isDummyNode1ToMarketingCostPath &&
        !isDummyNode1ToDeliveryCostPath && !isDummyNode1ToBenchCostPath &&
        !isDummyNode1ToDummyNode2Path && !isDummyNode2ToEBITDAPath
    }))
      .join("path")
      .attr("class", "link")
      .attr("d", d3.sankeyLinkHorizontal())
    //   .attr("stroke", function(d: any) { return color(d.source.name); })
    .attr("stroke", function(d: any) {
        const key = `${d.source.name}->${d.target.name}`;
        return pathColorMap[key as keyof typeof pathColorMap] || '#cccccc';
      })
      .attr("stroke-width", function(d: any) { return Math.max(1, d.width); })
      .attr("stroke-opacity", vizConfig.linkOpacity)
      .attr("fill", "none")
      .style("transition", "stroke-opacity 0.3s")
      .on("mouseover", function(event: any, d: any) {
        d3.select(this).attr("stroke-opacity", vizConfig.linkHoverOpacity);
        
        var tooltip = d3.select("body").append("div")
          .attr("class", "revenue-tooltip")
          .style("position", "absolute")
          .style("background", "rgba(0,0,0,0.8)")
          .style("color", "white")
          .style("padding", "8px")
          .style("border-radius", "4px")
          .style("font-size", "12px")
          .style("pointer-events", "none")
          .style("opacity", 0)
          .style("z-index", "1000");
        
        tooltip.transition().duration(200).style("opacity", 1);
        tooltip.html(d.source.name + " → " + d.target.name)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", function(event: any, d: any) {
        d3.select(this).attr("stroke-opacity", vizConfig.linkOpacity);
        d3.selectAll(".revenue-tooltip").remove();
      });
    
    var node = svg.append("g")
      .selectAll("g")
      .data(nodes.filter((d: any) => d.name !== "EarlyEnd" && d.name !== ""))
      .join("g")
      .attr("class", "node");
    
    node.append("rect")
      .attr("x", function(d: any) { return d.x0; })
      .attr("y", function(d: any) { return d.y0; })
      .attr("height", function(d: any) { return d.y1 - d.y0; })
      .attr("width", function(d: any) { return d.x1 - d.x0; })
    //   .attr("fill", function(d: any) { return color(d.name); })
      .attr("fill", function(d: any) { return nodeColorMap[d.name as keyof typeof nodeColorMap] || '#cccccc'; })
      .attr("stroke", "#333")
      .attr("stroke-width", 1)
      .style("cursor", "pointer")
      .style("transition", "all 0.3s ease")
      .on("click", handleNodeClick)
      .on("mouseover", function(event: any, d: any) {
        d3.select(this).style("filter", "brightness(1.1)");
        
        var tooltip = d3.select("body").append("div")
          .attr("class", "revenue-tooltip")
          .style("position", "absolute")
          .style("background", "rgba(0,0,0,0.9)")
          .style("color", "white")
          .style("padding", "10px")
          .style("border-radius", "5px")
          .style("font-size", "12px")
          .style("pointer-events", "none")
          .style("opacity", 0)
          .style("z-index", "1000")
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 28) + "px");
        
        var tooltipHtml = "<strong>" + d.name + "<br/><em>Click to view dashboard</em><br/>";
        if (dashboardUrls[d.name as keyof typeof dashboardUrls] && dashboardUrls[d.name as keyof typeof dashboardUrls].trim() !== "") {
          tooltipHtml += "";
        } else {
          tooltipHtml += "<small style=\"color: #ffcccc;\">No URL configured</small>";
        }
        
        tooltip.html(tooltipHtml);
        tooltip.transition().duration(200).style("opacity", 1);
      })
      .on("mouseout", function(event: any, d: any) {
        d3.select(this).style("filter", "brightness(1)");
        
        d3.selectAll(".revenue-tooltip").remove();
      });
    
    var nodeText = node.append("text")
      .attr("x", function(d: any) { return d.x0 < vizConfig.width / 2 ? d.x1 + 6 : d.x0 - 6; })
      .attr("y", function(d: any) { return (d.y1 + d.y0) / 2; })
      .attr("dy", "0.35em")
      .attr("text-anchor", function(d: any) { return d.x0 < vizConfig.width / 2 ? "start" : "end"; })
      .text(function(d: any) { return d.name; })
      .style("font-size", "12px")
      .style("font-weight", "bold")
      .style("fill", "#333")
      .style("pointer-events", "none");

    const labelsToWrap = [
        "Gross Profit", "Cost of Sales", 
        // "Direct Sales Cost", "Marketing Cost", "Delivery Cost", 
        // "Bench Cost", "Support Cost", "Alliance Cost",
        "Account Performance", "Sales Performance", "Marketing Performance"
        // "Account Profitability", "Project Profitability"
    ];

    nodeText.filter(function(d: any) {
        return labelsToWrap.includes(d.name);
    }).call(wrap, 60);
  }
};

looker.plugins.visualizations.add(vis); 
