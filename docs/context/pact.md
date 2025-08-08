# PACT Framework

The PACT (Prepare, Architect, Code, Test) framework is a structured approach to software development that ensures comprehensive planning, design, implementation, and verification of software solutions.

## Framework Overview

PACT is a four-phase development methodology:

1. **Prepare (P)** - Research and gather comprehensive documentation
2. **Architect (A)** - Design system architecture and specifications  
3. **Code (C)** - Implement the solution following architectural designs
4. **Test (T)** - Create and run comprehensive testing

## Core Principles

- **Documentation-Driven Development**: All phases generate comprehensive documentation that serves as input for subsequent phases
- **Incremental Knowledge Building**: Each phase builds upon the previous phase's outputs
- **Structured File Organization**: All intermediate documents are organized in a consistent directory structure
- **Architectural Integrity**: Implementation strictly follows architectural specifications
- **Comprehensive Testing**: Testing covers all aspects including functionality, security, and performance

## File Organization

All PACT work for a specific task should be organized in a dedicated directory:

```
@docs/pact/{task-name}/
├── research.md        # Prepare phase output
├── architecture.md    # Architect phase output  
├── implementation.md  # Code phase planning/notes (optional)
└── testing.md        # Test phase results and documentation
```

Where `{task-name}` is a descriptive kebab-case name for the task being worked on.

## Phase Definitions

### Prepare Phase
- **Purpose**: Research and gather comprehensive documentation for the project
- **Activities**: Find API documentation, best practices, code examples, technology research
- **Deliverables**: Comprehensive research documentation organized into Markdown files
- **Output Location**: `@docs/pact/{task-name}/research.md`
- **Agent**: `pact-preparer`

### Architect Phase  
- **Purpose**: Design comprehensive system architectures based on research
- **Activities**: Create architectural specifications, diagrams, API contracts, component designs
- **Deliverables**: Detailed architectural documentation with diagrams and implementation guidelines
- **Output Location**: `@docs/pact/{task-name}/architecture.md`
- **Agent**: `pact-architect`
- **Prerequisites**: Must have completed Prepare phase

### Code Phase
- **Purpose**: Implement the solution following architectural specifications
- **Activities**: Write code for backend, frontend, database, and other components as specified
- **Deliverables**: Production-ready code implementation
- **Agents**: `pact-backend-coder`, `pact-frontend-coder`, `pact-database-engineer`
- **Prerequisites**: Must have completed Architect phase
- **Documentation**: Optional implementation notes can be stored in `@docs/pact/{task-name}/implementation.md`

### Test Phase
- **Purpose**: Create and run comprehensive testing of implemented code
- **Activities**: Unit testing, integration testing, end-to-end testing, performance testing, security testing
- **Deliverables**: Complete test suite with passing results
- **Output Location**: `@docs/pact/{task-name}/testing.md`
- **Agent**: `pact-test-engineer`
- **Prerequisites**: Must have completed Code phase

## Agent Responsibilities

### All PACT Agents Must:
1. Load this context file (`@docs/context/pact.md`) at the beginning of their work
2. Reference and follow the architectural specifications from previous phases
3. Store all documentation in the appropriate `@docs/pact/{task-name}/` directory
4. Maintain consistency with the established file organization structure
5. Build incrementally on previous phase outputs

### Phase-Specific Requirements

#### Prepare Phase (pact-preparer)
- Create the task directory: `@docs/pact/{task-name}/`
- Gather comprehensive research on all relevant technologies
- Document API specifications, best practices, and code examples
- Organize findings into a structured `research.md` file

#### Architect Phase (pact-architect)
- Load and reference the research documentation from Prepare phase
- Create detailed system architecture with diagrams and specifications
- Define API contracts, database schemas, and component interfaces
- Document implementation guidelines and technical constraints
- Output comprehensive `architecture.md` with all design decisions

#### Code Phase (All coding agents)
- Load and strictly follow architectural specifications
- Implement only what is specified in the architecture
- Maintain architectural integrity throughout implementation
- Create production-ready, well-structured code
- Document any deviations or implementation notes if needed

#### Test Phase (pact-test-engineer)
- Create comprehensive test coverage for all implemented features
- Include unit tests, integration tests, and end-to-end tests
- Verify that implementation matches architectural specifications
- Document test results and coverage in `testing.md`
- Ensure all tests pass before marking phase complete

## Quality Gates

Each phase has specific quality requirements:

- **Prepare**: Research must be comprehensive and up-to-date
- **Architect**: Architecture must be complete, consistent, and implementable
- **Code**: Implementation must follow architecture exactly and be production-ready
- **Test**: All tests must pass and provide comprehensive coverage

## Usage Guidelines

1. **Task Naming**: Use descriptive, kebab-case names for task directories
2. **Documentation**: All phases must produce comprehensive documentation
3. **Sequential Execution**: Phases should be executed in order (P→A→C→T)
4. **Quality First**: Each phase must meet quality gates before proceeding
5. **Architectural Compliance**: Code phase must strictly adhere to architectural specifications

This framework ensures systematic, well-documented, and high-quality software development from conception through testing.