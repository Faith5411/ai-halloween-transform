#!/usr/bin/env python3

"""
Blockchain Smart Contract Analyzer using AI
Demonstrates GPU-accelerated contract analysis
"""

import torch
from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline
import json
import time
import re

class BlockchainAIAnalyzer:
    def __init__(self, model_size='small'):
        """Initialize the blockchain analyzer"""

        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        print(f"🚀 Initializing Blockchain AI Analyzer on {self.device}")

        if self.device.type == 'cuda':
            print(f"   GPU: {torch.cuda.get_device_name(0)}")
            print(f"   VRAM: {torch.cuda.get_device_properties(0).total_memory / 1e9:.2f} GB\n")

        # Choose model based on size preference
        if model_size == 'small':
            # GPT-2 for demonstration (you can replace with CodeLlama)
            model_name = "gpt2-medium"
        else:
            # For larger models like CodeLlama (requires more setup)
            model_name = "microsoft/codebert-base"

        print(f"📦 Loading model: {model_name}")
        self.tokenizer = AutoTokenizer.from_pretrained(model_name)
        self.model = AutoModelForCausalLM.from_pretrained(model_name)
        self.model = self.model.to(self.device)
        self.model.eval()

        # Set padding token
        if self.tokenizer.pad_token is None:
            self.tokenizer.pad_token = self.tokenizer.eos_token

        print("✅ Model loaded successfully\n")

    def analyze_smart_contract(self, contract_code):
        """Analyze a smart contract for vulnerabilities"""

        print("🔍 Analyzing Smart Contract...")
        print("="*60)

        # Pattern-based vulnerability detection
        vulnerabilities = self.detect_vulnerability_patterns(contract_code)

        # AI-based analysis
        ai_analysis = self.ai_contract_analysis(contract_code)

        # Gas optimization suggestions
        gas_suggestions = self.analyze_gas_optimization(contract_code)

        return {
            'vulnerabilities': vulnerabilities,
            'ai_analysis': ai_analysis,
            'gas_optimization': gas_suggestions
        }

    def detect_vulnerability_patterns(self, code):
        """Detect common vulnerability patterns"""

        print("🛡️  Checking for common vulnerabilities...")

        vulnerabilities = []

        # Reentrancy vulnerability
        if re.search(r'\.call\{value:|\.call\.value\(|\.send\(', code):
            if 'ReentrancyGuard' not in code:
                vulnerabilities.append({
                    'type': 'REENTRANCY',
                    'severity': 'HIGH',
                    'description': 'Potential reentrancy vulnerability detected. External calls before state changes.',
                    'recommendation': 'Use ReentrancyGuard or follow checks-effects-interactions pattern'
                })

        # Integer overflow/underflow (for older Solidity)
        if 'pragma solidity ^0.7' in code or 'pragma solidity ^0.6' in code:
            if 'SafeMath' not in code:
                vulnerabilities.append({
                    'type': 'INTEGER_OVERFLOW',
                    'severity': 'MEDIUM',
                    'description': 'No SafeMath library detected for older Solidity version',
                    'recommendation': 'Use SafeMath library or upgrade to Solidity 0.8+'
                })

        # Unchecked return values
        if '.transfer(' in code or '.send(' in code:
            vulnerabilities.append({
                'type': 'UNCHECKED_RETURN',
                'severity': 'MEDIUM',
                'description': 'Using transfer() or send() without checking return value',
                'recommendation': 'Check return values or use call() with proper error handling'
            })

        # Timestamp dependence
        if 'block.timestamp' in code or 'now' in code:
            vulnerabilities.append({
                'type': 'TIMESTAMP_DEPENDENCE',
                'severity': 'LOW',
                'description': 'Contract depends on block.timestamp which can be manipulated by miners',
                'recommendation': 'Avoid using timestamp for critical logic'
            })

        # Tx.origin authentication
        if 'tx.origin' in code:
            vulnerabilities.append({
                'type': 'TX_ORIGIN_AUTH',
                'severity': 'HIGH',
                'description': 'Using tx.origin for authentication is vulnerable to phishing attacks',
                'recommendation': 'Use msg.sender instead of tx.origin'
            })

        # Uninitialized storage pointers
        if re.search(r'(struct|mapping).*storage\s+\w+;', code):
            vulnerabilities.append({
                'type': 'UNINITIALIZED_STORAGE',
                'severity': 'HIGH',
                'description': 'Potential uninitialized storage pointer',
                'recommendation': 'Initialize storage variables explicitly'
            })

        return vulnerabilities

    def ai_contract_analysis(self, contract_code):
        """Use AI to analyze contract logic"""

        print("🤖 Running AI analysis...")

        # Simplified prompt for demonstration
        prompt = f"""Analyze this smart contract code for potential issues:

{contract_code[:500]}  # Truncate for demo

Key areas to check:
1. Security vulnerabilities
2. Logic errors
3. Best practice violations

Analysis:"""

        # Generate analysis
        inputs = self.tokenizer.encode(prompt, return_tensors='pt', max_length=512, truncation=True)
        inputs = inputs.to(self.device)

        start_time = time.time()

        with torch.no_grad():
            outputs = self.model.generate(
                inputs,
                max_length=200,
                temperature=0.7,
                pad_token_id=self.tokenizer.eos_token_id,
                do_sample=True
            )

        analysis_time = time.time() - start_time

        analysis = self.tokenizer.decode(outputs[0], skip_special_tokens=True)

        # Extract only the generated part
        analysis = analysis[len(prompt):]

        print(f"   ✅ AI analysis completed in {analysis_time:.2f}s")

        return analysis.strip()

    def analyze_gas_optimization(self, code):
        """Suggest gas optimizations"""

        print("⛽ Analyzing gas optimization opportunities...")

        suggestions = []

        # Storage optimization
        if code.count('storage') > 5:
            suggestions.append({
                'type': 'STORAGE_OPTIMIZATION',
                'suggestion': 'Consider batching storage operations to reduce gas costs',
                'potential_savings': '~20%'
            })

        # Loop optimization
        if 'for' in code or 'while' in code:
            suggestions.append({
                'type': 'LOOP_OPTIMIZATION',
                'suggestion': 'Consider using mappings instead of loops where possible',
                'potential_savings': '~50%'
            })

        # String usage
        if 'string' in code:
            suggestions.append({
                'type': 'STRING_OPTIMIZATION',
                'suggestion': 'Consider using bytes32 instead of string for fixed-size data',
                'potential_savings': '~30%'
            })

        # Event optimization
        if 'emit' not in code:
            suggestions.append({
                'type': 'EVENT_USAGE',
                'suggestion': 'Use events for data that doesn\'t need on-chain storage',
                'potential_savings': '~90% for logged data'
            })

        return suggestions

    def analyze_defi_protocol(self, protocol_name, tvl, volume_24h):
        """Analyze DeFi protocol risks"""

        print(f"\n📊 Analyzing DeFi Protocol: {protocol_name}")
        print("="*60)

        risk_score = 0
        risk_factors = []

        # TVL risk assessment
        if tvl < 1_000_000:
            risk_score += 30
            risk_factors.append("Low TVL indicates limited adoption or new protocol")
        elif tvl < 10_000_000:
            risk_score += 20
            risk_factors.append("Moderate TVL - growing but not fully established")
        else:
            risk_score += 10
            risk_factors.append("High TVL indicates good adoption")

        # Volume analysis
        volume_ratio = volume_24h / tvl if tvl > 0 else 0
        if volume_ratio < 0.01:
            risk_score += 20
            risk_factors.append("Low volume/TVL ratio - potential liquidity issues")
        elif volume_ratio > 2:
            risk_score += 15
            risk_factors.append("Very high volume/TVL ratio - potential volatility")

        # Calculate final risk level
        if risk_score < 30:
            risk_level = "LOW"
        elif risk_score < 60:
            risk_level = "MEDIUM"
        else:
            risk_level = "HIGH"

        return {
            'protocol': protocol_name,
            'risk_level': risk_level,
            'risk_score': risk_score,
            'risk_factors': risk_factors,
            'metrics': {
                'tvl': tvl,
                'volume_24h': volume_24h,
                'volume_ratio': volume_ratio
            }
        }

    def detect_mev_opportunity(self, transaction_data):
        """Detect potential MEV opportunities"""

        print("\n💰 Checking for MEV opportunities...")

        mev_types = []

        # Check for arbitrage opportunity
        if transaction_data.get('price_difference', 0) > 0.01:
            mev_types.append({
                'type': 'ARBITRAGE',
                'profit_potential': transaction_data['price_difference'],
                'description': 'Price difference detected between DEXes'
            })

        # Check for liquidation opportunity
        if transaction_data.get('health_factor', 1.5) < 1.1:
            mev_types.append({
                'type': 'LIQUIDATION',
                'profit_potential': transaction_data.get('collateral_value', 0) * 0.05,
                'description': 'Position close to liquidation threshold'
            })

        # Check for sandwich attack potential
        if transaction_data.get('slippage_tolerance', 0) > 0.03:
            mev_types.append({
                'type': 'SANDWICH',
                'profit_potential': 'Variable',
                'description': 'High slippage tolerance makes sandwich attack profitable'
            })

        return mev_types

def demo_contract_analysis():
    """Demo analyzing a vulnerable contract"""

    # Example vulnerable contract
    vulnerable_contract = """
pragma solidity ^0.7.0;

contract VulnerableBank {
    mapping(address => uint256) public balances;

    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }

    function withdraw(uint256 amount) public {
        require(balances[msg.sender] >= amount, "Insufficient balance");

        // Vulnerable: external call before state update
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");

        balances[msg.sender] -= amount;
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
"""

    # Create analyzer
    analyzer = BlockchainAIAnalyzer(model_size='small')

    # Analyze contract
    print("\n" + "="*60)
    print("📝 CONTRACT ANALYSIS REPORT")
    print("="*60)

    results = analyzer.analyze_smart_contract(vulnerable_contract)

    # Print vulnerabilities
    print("\n🚨 VULNERABILITIES FOUND:")
    for vuln in results['vulnerabilities']:
        print(f"\n   [{vuln['severity']}] {vuln['type']}")
        print(f"   Description: {vuln['description']}")
        print(f"   Fix: {vuln['recommendation']}")

    # Print gas optimizations
    print("\n⛽ GAS OPTIMIZATION SUGGESTIONS:")
    for opt in results['gas_optimization']:
        print(f"\n   • {opt['type']}")
        print(f"     {opt['suggestion']}")
        print(f"     Potential savings: {opt['potential_savings']}")

    # Demo DeFi analysis
    print("\n" + "="*60)
    print("📊 DEFI PROTOCOL ANALYSIS")
    print("="*60)

    defi_result = analyzer.analyze_defi_protocol(
        protocol_name="Example Protocol",
        tvl=5_000_000,
        volume_24h=250_000
    )

    print(f"\n   Protocol: {defi_result['protocol']}")
    print(f"   Risk Level: {defi_result['risk_level']} (Score: {defi_result['risk_score']}/100)")
    print(f"   TVL: ${defi_result['metrics']['tvl']:,.0f}")
    print(f"   24h Volume: ${defi_result['metrics']['volume_24h']:,.0f}")
    print(f"   Volume/TVL Ratio: {defi_result['metrics']['volume_ratio']:.2%}")

    print("\n   Risk Factors:")
    for factor in defi_result['risk_factors']:
        print(f"   • {factor}")

    # Demo MEV detection
    print("\n" + "="*60)
    print("💰 MEV OPPORTUNITY DETECTION")
    print("="*60)

    sample_tx = {
        'price_difference': 0.025,
        'health_factor': 1.05,
        'slippage_tolerance': 0.05,
        'collateral_value': 10000
    }

    mev_opportunities = analyzer.detect_mev_opportunity(sample_tx)

    for opp in mev_opportunities:
        print(f"\n   Type: {opp['type']}")
        print(f"   Profit Potential: {opp['profit_potential']}")
        print(f"   Description: {opp['description']}")

    # Print performance stats
    print("\n" + "="*60)
    print("⚡ PERFORMANCE METRICS")
    print("="*60)
    print(f"   GPU Memory Used: {torch.cuda.memory_allocated()/1e6:.2f} MB")
    print(f"   Peak Memory: {torch.cuda.max_memory_allocated()/1e6:.2f} MB")

if __name__ == "__main__":
    print("="*60)
    print("🔗 BLOCKCHAIN AI ANALYZER")
    print("Smart Contract Security & DeFi Analysis")
    print("="*60)

    try:
        demo_contract_analysis()
    except Exception as e:
        print(f"\n❌ Error: {e}")
        print("\n📦 Make sure you have the required packages:")
        print("pip install torch transformers accelerate")