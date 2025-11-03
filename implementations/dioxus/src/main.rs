use dioxus::prelude::*;

#[derive(Clone, PartialEq)]
struct Todo {
    id: usize,
    text: String,
    completed: bool,
}

#[derive(Clone, Copy, PartialEq)]
enum Filter {
    All,
    Active,
    Completed,
}

fn main() {
    dioxus::launch(App);
}

#[component]
fn App() -> Element {
    // Generate 100 initial todos
    let initial_todos: Vec<Todo> = (1..=100)
        .map(|i| Todo {
            id: i,
            text: format!("Todo item {}", i),
            completed: i % 3 == 0,
        })
        .collect();

    let mut todos = use_signal(|| initial_todos);
    let mut input_value = use_signal(String::new);
    let mut filter = use_signal(|| Filter::All);
    let mut next_id = use_signal(|| 101usize);

    // Computed values
    let filtered_todos = use_memo(move || {
        todos.read().iter().filter(|todo| match filter.read().as_ref() {
            Filter::All => true,
            Filter::Active => !todo.completed,
            Filter::Completed => todo.completed,
        })
        .cloned()
        .collect::<Vec<_>>()
    });

    let remaining_count = use_memo(move || {
        todos.read().iter().filter(|t| !t.completed).count()
    });

    // Actions
    let add_todo = move |_| {
        let text = input_value.read().clone();
        if !text.trim().is_empty() {
            let id = *next_id.read();
            todos.write().insert(
                0,
                Todo {
                    id,
                    text: text.clone(),
                    completed: false,
                },
            );
            *next_id.write() = id + 1;
            *input_value.write() = String::new();
        }
    };

    rsx! {
        div { class: "todo-app",
            div { class: "todo-header",
                h1 { "Todo List" }
                span { class: "framework-badge", "Dioxus" }
            }

            div { class: "todo-input-container",
                input {
                    r#type: "text",
                    class: "todo-input",
                    placeholder: "What needs to be done?",
                    value: "{input_value}",
                    oninput: move |evt| input_value.set(evt.value().clone()),
                    onkeypress: move |evt| {
                        if evt.key() == Key::Enter {
                            add_todo(());
                        }
                    },
                    "aria-label": "New todo input"
                }
                button {
                    class: "btn btn-primary",
                    onclick: add_todo,
                    "aria-label": "Add todo",
                    "Add"
                }
            }

            div { class: "todo-filters",
                button {
                    class: if *filter.read() == Filter::All { "btn filter-btn active" } else { "btn filter-btn" },
                    onclick: move |_| filter.set(Filter::All),
                    "aria-label": "Show all todos",
                    "All"
                }
                button {
                    class: if *filter.read() == Filter::Active { "btn filter-btn active" } else { "btn filter-btn" },
                    onclick: move |_| filter.set(Filter::Active),
                    "aria-label": "Show active todos",
                    "Active"
                }
                button {
                    class: if *filter.read() == Filter::Completed { "btn filter-btn active" } else { "btn filter-btn" },
                    onclick: move |_| filter.set(Filter::Completed),
                    "aria-label": "Show completed todos",
                    "Completed"
                }
            }

            div { class: "todo-stats",
                "{remaining_count} {if *remaining_count.read() == 1 { \"item\" } else { \"items\" }} remaining"
            }

            if filtered_todos.read().is_empty() {
                div { class: "empty-state",
                    div { class: "empty-state-icon", "📝" }
                    div { class: "empty-state-text", "No todos to display" }
                }
            } else {
                ul { class: "todo-list",
                    for todo in filtered_todos.read().iter() {
                        {
                            let id = todo.id;
                            let completed = todo.completed;
                            let text = todo.text.clone();
                            rsx! {
                                li { 
                                    class: if completed { "todo-item completed" } else { "todo-item" },
                                    input {
                                        r#type: "checkbox",
                                        class: "todo-checkbox",
                                        checked: completed,
                                        onchange: move |_| {
                                            if let Some(t) = todos.write().iter_mut().find(|t| t.id == id) {
                                                t.completed = !t.completed;
                                            }
                                        },
                                        "aria-label": "Toggle {text}"
                                    }
                                    span { class: "todo-text", "{text}" }
                                    button {
                                        class: "btn btn-delete",
                                        onclick: move |_| {
                                            todos.write().retain(|t| t.id != id);
                                        },
                                        "aria-label": "Delete {text}",
                                        "Delete"
                                    }
                                }
                            }
                        }
                    }
                }
            }

            div { class: "todo-footer",
                "Frontend Benchmark - Dioxus Implementation"
            }
        }
    }
}
