require("mason").setup()
require("mason-lspconfig").setup({
	ensure_installed = { 
          "lua_ls", "ts_ls", "vuels", "yamlls", "jsonls", "robotframework_ls", "tailwindcss", "prismals", "gopls"
  }
})

local on_attach = function()
	vim.keymap.set('n', 'ca', vim.lsp.buf.code_action, {})
	vim.keymap.set('n', 'gd', vim.lsp.buf.definition, {})
	vim.keymap.set('n', 'K', vim.lsp.buf.hover, {})
end

local capabilities = require("cmp_nvim_lsp").default_capabilities()


require("lspconfig").lua_ls.setup {
	on_attach = on_attach,
	capabilities = capabilities
}

require("lspconfig").jsonls.setup {
	on_attach = on_attach,
	capabilities = capabilities
}

require'lspconfig'.gopls.setup{
	on_attach = on_attach,
	capabilities = capabilities
}

require'lspconfig'.ts_ls.setup{
	on_attach = on_attach,
	capabilities = capabilities
}

require'lspconfig'.vuels.setup{
	on_attach = on_attach,
	capabilities = capabilities
}

require'lspconfig'.robotframework_ls.setup{
	on_attach = on_attach,
	capabilities = capabilities,
    settings = {
        ["robot.python.env"] = {
            RF_PROJ_ROOT = "/home/khang/Projects/DXC/UPTime/system-tests",
            PYTHONPATH = "/home/khang/Projects/DXC/UPTime/system-tests/lib:/home/khang/Projects/DXC/UPTime/system-tests:/home/khang/Projects/DXC/UPTime/system-tests/robot/lib/python3.11/site-packages"
            
        },
        ["robot.language-server.python"] = "/home/khang/Projects/DXC/UPTime/system-tests/robot/bin/python3",
        ["robot.libraries.libdoc.needsArgs"] = {
                "servicenow.ServiceNow",
                "servicenow.Hardware",
                "servicenow.RequestedItem",
                "servicenow.Request",
                "servicenow.CatalogTask",
                "servicenow.RequestItemVariable",
                "servicenow.ApproverTask",
                "servicenow.Variables",
                "servicenow.User",
                "servicenow.Model",
                "servicenow.Incident",
                "servicenow.Stockroom",
                "servicenow.UptimeAsset",
                "uptime.Uptime",
                "uptime.PclService",
                "uptime.OrderService",
                "uptime.BaseService",
                "uptime.ConfigService",
                "uptime.ProvisioningService",
                "uptime.KnowledgeService",
                "uptime.DeviceManagementService",
                "uptime.JobManagementService",
                "cosmosdb.M365CosmosDB",
                "cosmosdb.BasicCosmosDB",
                "cosmosdb.PclCosmosDB",
                "cosmosdb.JobManagementCosmosDB",
                "azure-function.PclAzureFunction",
                "utils.py",
                "util2.py",
                "EnvVariables.py",
                "OAuth2Client.py",
        }
    }
}

require'lspconfig'.yamlls.setup{
	on_attach = on_attach,
	capabilities = capabilities,
  settings = {
        yaml = {
            schemas = {
                    ["https://raw.githubusercontent.com/aws/serverless-application-model/main/samtranslator/schema/schema.json"] = {
                        "/template.yaml",
                        "/cloudformation/*.yaml"
                    }
            },
            customTags = { "!Ref", "!ImportValue", "!Sub", "!GetAtt" }
        }
    }
}

require('lspconfig').jdtls.setup({})

require('lspconfig').tailwindcss.setup{}
