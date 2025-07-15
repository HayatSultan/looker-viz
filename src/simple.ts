import { Looker, VisualizationDefinition } from './types';

declare var looker: Looker;
declare var d3: any;

const vis: VisualizationDefinition = {
  id: "revenue_to_end_flow",
  label: "Revenue to End Flow",
  options: {
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
    operating_profit_dashboard_url: {
      type: "string",
      label: "Operating Profit Dashboard URL",
      default: "",
      section: "Dashboard Links"
    },
    operating_expenses_dashboard_url: {
      type: "string",
      label: "Operating Expenses Dashboard URL",
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
    }
  },
  
  readyPromise: null,

  create: function(element, config) {
    this.readyPromise = new Promise((resolve) => {
      const setup = () => {
        this.container = d3.select(element)
          .append("div")
          .attr("class", "revenue-sankey-container")
          .style("width", "100%")
          .style("height", "100%")
          .style("font-family", "Arial, sans-serif")
          .style("background-color", "white")
          .style("border-radius", "8px")
          .style("box-shadow", "0 2px 10px rgba(0,0,0,0.1)")
          .style("padding", "20px");
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
      this.render(config);
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
  
  render: function(config: any) {
    
    // Clear previous content
    this.container.selectAll("*").remove();
    
    // Configuration
    var vizConfig = {
      width: 1200,
      height: 600,
      margin: {top: 40, right: 40, bottom: 40, left: 40},
      nodeWidth: 20,
      nodePadding: 30,
      linkOpacity: 0.5,
      linkHoverOpacity: 0.7
    };
    
    // Dashboard URL mapping
    var dashboardUrls = {
      "Revenue": config.revenue_dashboard_url,
      "Gross Profit": config.gross_profit_dashboard_url,
      "Operating Profit": config.operating_profit_dashboard_url,
      "Operating Expenses": config.operating_expenses_dashboard_url,
      "Cost of Sales": config.cost_of_sales_dashboard_url,
      "Alliance Cost": config.alliance_cost_dashboard_url,
      "Direct Sales Cost": config.direct_sales_cost_dashboard_url,
      "Marketing Cost": config.marketing_cost_dashboard_url,
      "Delivery Cost": config.delivery_cost_dashboard_url,
      "Bench Cost": config.bench_cost_dashboard_url,
      "EBITDA": config.ebitda_dashboard_url,
      "Account Profitability": config.account_profitability_dashboard_url,
      "Project Profitability": config.project_profitability_dashboard_url,
      "Support Cost": config.support_cost_dashboard_url,
      "Non-Billable Cost": config.non_billable_cost_dashboard_url
    };
    
    // Data for Revenue to End flow
    var data = {
      nodes: [
        {name: "Revenue", id: "revenue"},
        {name: "Gross Profit", id: "gross_profit"},
        {name: "Operating Profit", id: "operating_profit"},
        {name: "Operating Expenses", id: "operating_expenses"},
        {name: "Cost of Sales", id: "cost_of_sales"},
        {name: "Alliance Cost", id: "alliance_cost"},
        {name: "Direct Sales Cost", id: "direct_sales_cost"},
        {name: "Marketing Cost", id: "marketing_cost"},
        {name: "Delivery Cost", id: "delivery_cost"},
        {name: "Bench Cost", id: "bench_cost"},
        {name: "EBITDA", id: "ebitda"},
        {name: "Account Profitability", id: "account_profitability"},
        {name: "Project Profitability", id: "project_profitability"},
        {name: "Support Cost", id: "support_cost"},
        {name: "Non-Billable Cost", id: "non_billable_cost"}
      ],
      links: [
        {source: 0, target: 1, value: 300},     // Revenue → Gross Profit
        {source: 1, target: 2, value: 125},     // Gross Profit → Operating Profit
        {source: 1, target: 3, value: 100},     // Gross Profit → Operating Expenses
        {source: 1, target: 4, value: 75},      // Gross Profit → Cost of Sales
        {source: 3, target: 5, value: 20},      // Operating Expenses → Alliance Cost
        {source: 3, target: 6, value: 20},      // Operating Expenses → Direct Sales Cost
        {source: 3, target: 7, value: 20},      // Operating Expenses → Marketing Cost
        {source: 3, target: 8, value: 20},      // Operating Expenses → Delivery Cost
        {source: 3, target: 9, value: 20},      // Operating Expenses → Bench Cost
        {source: 2, target: 10, value: 125},    // Operating Profit → EBITDA
        {source: 10, target: 11, value: 62.5},  // EBITDA → Account Profitability
        {source: 10, target: 12, value: 62.5},  // EBITDA → Project Profitability
        {source: 4, target: 13, value: 37.5},   // Cost of Sales → Support Cost
        {source: 4, target: 14, value: 37.5}    // Cost of Sales → Non-Billable Cost
      ]
    };
    
    var svg = this.container
      .append("svg")
      .attr("width", vizConfig.width)
      .attr("height", vizConfig.height);
    
    svg.append("text")
      .attr("x", vizConfig.width / 2)
      .attr("y", 25)
      .attr("text-anchor", "middle")
      .style("font-size", "18px")
      .style("font-weight", "bold")
      .style("fill", "#333")
      .text("Revenue to End Flow");
    
    var sankey = d3.sankey()
      .nodeWidth(vizConfig.nodeWidth)
      .nodePadding(vizConfig.nodePadding)
      .extent([[vizConfig.margin.left, vizConfig.margin.top], 
              [vizConfig.width - vizConfig.margin.right, vizConfig.height - vizConfig.margin.bottom]]);
    
    var color = d3.scaleOrdinal(d3.schemeCategory10);
    
    function handleNodeClick(event: any, d: any) {
      var dashboardUrl = dashboardUrls[d.name as keyof typeof dashboardUrls];
      
      if (dashboardUrl && dashboardUrl.trim() !== "") {
        window.open(dashboardUrl, "_blank");
      } else {
        alert("No dashboard URL configured for " + d.name + ". Please configure it in the visualization settings.");
      }
    }
    
    var sankeyData = sankey(data);
    var nodes = sankeyData.nodes;
    var links = sankeyData.links;
    
    svg.append("g")
      .selectAll("path")
      .data(links)
      .join("path")
      .attr("class", "link")
      .attr("d", d3.sankeyLinkHorizontal())
      .attr("stroke", function(d: any) { return color(d.source.name); })
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
        tooltip.html(d.source.name + " → " + d.target.name + "<br/>Value: " + d.value.toLocaleString())
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", function(event: any, d: any) {
        d3.select(this).attr("stroke-opacity", vizConfig.linkOpacity);
        d3.selectAll(".revenue-tooltip").remove();
      });
    
    var node = svg.append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .attr("class", "node");
    
    node.append("rect")
      .attr("x", function(d: any) { return d.x0; })
      .attr("y", function(d: any) { return d.y0; })
      .attr("height", function(d: any) { return d.y1 - d.y0; })
      .attr("width", function(d: any) { return d.x1 - d.x0; })
      .attr("fill", function(d: any) { return color(d.name); })
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
        
        var tooltipHtml = "<strong>" + d.name + "</strong><br/>Value: " + d.value.toLocaleString() + "<br/><em>Click to view dashboard</em><br/>";
        if (dashboardUrls[d.name as keyof typeof dashboardUrls] && dashboardUrls[d.name as keyof typeof dashboardUrls].trim() !== "") {
          tooltipHtml += "<small>→ Dashboard configured</small>";
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
    
    node.append("text")
      .attr("x", function(d: any) { return d.x0 < vizConfig.width / 2 ? d.x1 + 6 : d.x0 - 6; })
      .attr("y", function(d: any) { return (d.y1 + d.y0) / 2; })
      .attr("dy", "0.35em")
      .attr("text-anchor", function(d: any) { return d.x0 < vizConfig.width / 2 ? "start" : "end"; })
      .text(function(d: any) { return d.name; })
      .style("font-size", "12px")
      .style("font-weight", "bold")
      .style("fill", "#333")
      .style("pointer-events", "none");
  }
};

looker.plugins.visualizations.add(vis); 
