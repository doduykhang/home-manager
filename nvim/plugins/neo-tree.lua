-- disable netrw at the very start of your init.lua (strongly advised)
vim.g.loaded_netrw = 1
vim.g.loaded_netrwPlugin = 1

-- set termguicolors to enable highlight groups
vim.opt.termguicolors = true

vim.keymap.set("n", "<leader>e", ":Neotree <CR>")

require("neo-tree").setup({
    filesystem = {
        follow_current_file = true,
        filtered_items = {
            visible = true, 
            show_hidden_count = true,
            hide_dotfiles = false,
            hide_gitignore = false
        }
    }
})

